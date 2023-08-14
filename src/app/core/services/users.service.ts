import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {UpdateUserDto, User} from "../models/User";


@Injectable({
  providedIn: 'root'
})
export class UsersService {

   API_URL="http://localhost:3000/users"
   constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log(token)
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsers(role: string, sd: string): Observable<User[]> {
    const url = `${this.API_URL}/${role}/${sd}`;
    const headers = this.getHeaders();
    return this.http.get<User[]>(url, { headers });
  }

  getUserById(id: number): Observable<User> {
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    const x= this.http.get<User>(url, { headers });
    console.log(x)
    return  x;
  }

  createUser(userData: { email:string,role:string }): Observable<any> {
    const url = `http://localhost:3000/auth/register`
    const headers = this.getHeaders();
    return this.http.post<any>(url, userData, { headers });
  }

  updateUser(id: number, userData: UpdateUserDto): Observable<UpdateUserDto> {
    const { deletedAt, ...newUserData } = userData;
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    return this.http.put<UpdateUserDto>(url, newUserData, { headers });
  }

  softDeleteUser(id: number): Observable<string> {
    const url = `${this.API_URL}/softdelete/${id}`;
    const headers = this.getHeaders();
    const x=this.http.patch<string>(url, null, { headers });
    return x;
  }

  restoreUser(id: number): Observable<string> {

      const url = `${this.API_URL}/restore/${id}`;
      const headers = this.getHeaders();
    return this.http.patch<string>(url, null, { headers }).pipe(
      catchError((error) => {
        console.log(error);
        return throwError('Error occurred during user restoration.');
      })
    );


  }

  deleteUser(id: number): Observable<{ message:string }> {
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    return this.http.delete<{ message:string }>(url, { headers });
  }
}
