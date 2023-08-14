import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UpdateZoneDto, Zone} from "../models/Zone";
import {CreateSousTraitantDto, Subcontractor, UpdateSousTraitantDto} from "../models/Subcontractor";

@Injectable({
  providedIn: 'root'
})
export class SubcontractorService {

  API_URL="http://localhost:3000/sous-traitants"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log(token)
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getAllSubcontractors():Observable<Subcontractor[]>{
    const url = `${this.API_URL}`;
    const headers = this.getHeaders();
    return this.http.get<Subcontractor[]>(url, { headers });
  }
  getSubcontractorByID(id:number):Observable<Subcontractor>{
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<Subcontractor>(url, { headers });
  }
  updateSubcontractor(id: number,zoneData:UpdateSousTraitantDto):Observable<Subcontractor>{
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    return this.http.patch<Subcontractor>(url, zoneData, { headers });
  }
  deleteSubcontractor(id: number): Observable<{ message:string }> {
    const url = `${this.API_URL}/force/${id}`;
    const headers = this.getHeaders();
    return this.http.delete<{ message:string }>(url, { headers });
  }
  createSubcontractor(zoneData:CreateSousTraitantDto): Observable<Subcontractor> {
    const url = `${this.API_URL}`
    const headers = this.getHeaders();
    return this.http.post<Subcontractor>(url, zoneData, { headers });
  }

}
