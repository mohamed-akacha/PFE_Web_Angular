import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL="http://localhost:3000/auth"
  private readonly JWT_TOKEN_KEY = 'jwtToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  constructor(private http:HttpClient) { }

  decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  storeTokens(tokens: { access_token: string, refresh_token: string }): void {
    localStorage.setItem(this.JWT_TOKEN_KEY, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token);
  }

  refreshToken(): Observable<{ access_token: string }> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ access_token: string }>(`${this.API_URL}/refresh-token`, { refresh_token: refreshToken });
  }

  logout(): void {
    localStorage.removeItem(this.JWT_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    // Perform any additional cleanup or redirection if needed
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  login(credentials: any): Observable<{ access_token: string, refresh_token: string }> {
    return this.http.post<{ access_token: string, refresh_token: string }>(`${this.API_URL}/login`, credentials);
  }

  confirmAccount(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${userId}`, userData);
  }

  getConfirm(hashedId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/confirm/${hashedId}`);
  }

  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-email`, { email });
  }

  verifyEmailCode(verifyEmailCode: any): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-email-code`, verifyEmailCode);
  }

  resetPassword(resetPasswordDto: any): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, resetPasswordDto);
  }
}
