import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreateInstitutionDto, Institution, UpdateInstitutionDto} from "../models/institution";


@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  API_URL="http://localhost:3000/institutions"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log(token)
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllInstitutions():Observable<Institution[]>{
    const url = `${this.API_URL}`;
    const headers = this.getHeaders();
    return this.http.get<Institution[]>(url, { headers });
  }
  getAllInstitutionsA():Observable<Institution[]>{
    const url = `${this.API_URL}/A`;
    const headers = this.getHeaders();
    return this.http.get<Institution[]>(url, { headers });
  }
  getInstitutionsByZone(idZone:number):Observable<Institution[]>{
    const url = `${this.API_URL}/byzone/${idZone}`;
    const headers = this.getHeaders();
    return this.http.get<Institution[]>(url, { headers });
  }
  getInstitutionsByZoneA(idZone:number):Observable<Institution[]>{
    const url = `${this.API_URL}/byzone/A/${idZone}`;
    const headers = this.getHeaders();
    return this.http.get<Institution[]>(url, { headers });
  }

  getInstitutionsById(instId: number) {
    const url = `${this.API_URL}/${instId}`;
    const headers = this.getHeaders();
    return this.http.get<Institution>(url, { headers });
  }

  updateInstitution(instId: number, userData: UpdateInstitutionDto) {
    const url = `${this.API_URL}/${instId}`;
    const headers = this.getHeaders();
    return this.http.patch<Institution>(url,userData, { headers });
  }

  createInstitution(instData:CreateInstitutionDto){
    const url=`${this.API_URL}`;
    const headers=this.getHeaders();
    return this.http.post<Institution>(url,instData,{headers})
  }
  deleteInstitution(instId:number):Observable<string>{
    const url=`${this.API_URL}/force/${instId}`;
    const headers=this.getHeaders();
    return this.http.delete<string>(url,{headers})
  }
}
