import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {UpdateZoneDto, Zone} from "../models/Zone";

@Injectable({
  providedIn: 'root'
})
export class ZoneService{
  API_URL="http://localhost:3000/zones"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log(token)
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getAllZones():Observable<Zone[]>{
    const url = `${this.API_URL}`;
    const headers = this.getHeaders();
    return this.http.get<Zone[]>(url, { headers });
  }
  getZoneByID(id:number):Observable<Zone>{
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Zone>(url, { headers });
  }
  updateZone(id: number,zoneData:UpdateZoneDto):Observable<any>{
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    return this.http.put<UpdateZoneDto>(url, zoneData, { headers });
  }
  deleteZone(id: number): Observable<string> {
    const url = `${this.API_URL}/force/${id}`;
    const headers = this.getHeaders();
    return this.http.delete<string>(url, { headers });
  }
  createZone(zoneData: { nom:string}): Observable<any> {
    const url = `${this.API_URL}`
    const headers = this.getHeaders();
    return this.http.post<any>(url, zoneData, { headers });
  }
}
