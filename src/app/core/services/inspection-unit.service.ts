import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreateInspectionUnitDto, InspectionUnit} from "../models/InspectionUnit";

@Injectable({
  providedIn: 'root'
})
export class InspectionUnitService {

  API_URL="http://localhost:3000/inspection-units"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log(token)
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getUnitsByInstitution(id:number):Observable<any>{
    const url=`${this.API_URL}/byInstitution/${id}`;
    const headers=this.getHeaders();
    return this.http.get<InspectionUnit[]|null>(url,{headers})
  }

  addUI(instData: CreateInspectionUnitDto):Observable<InspectionUnit> {
    const url=`${this.API_URL}`;
    const headers=this.getHeaders();
    return this.http.post<InspectionUnit>(url,instData, {headers})
  }
}
