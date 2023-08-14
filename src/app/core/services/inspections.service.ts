import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreateInspectionDto, Inspection} from "../models/Inspection";

@Injectable({
  providedIn: 'root'
})
export class InspectionsService {

  API_URL="http://localhost:3000/inspections"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log(token)
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getAllInspections():Observable<Inspection[]>{
    const url = `${this.API_URL}`;
    const headers = this.getHeaders();
    return this.http.get<Inspection[]>(url, { headers });
  }

  getAllInspectionsByInst(selectedInstitution: number) {
    const url = `${this.API_URL}/byinst/${selectedInstitution}`;
    const headers = this.getHeaders();
    return this.http.get<Inspection[]>(url, { headers });
  }

  createInspection(inspecData: CreateInspectionDto):Observable<any> {
    const url = `${this.API_URL}`;
    const headers = this.getHeaders();
    return this.http.post<any>(url,inspecData,{headers})
  }

  getInspectionById(inspectionId: number) :Observable<Inspection>{
    const url = `${this.API_URL}/${inspectionId}`;
    const headers = this.getHeaders();
    return this.http.get<Inspection>(url,{headers})
  }
}
