import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UpdateZoneDto, Zone} from "../models/Zone";
import {Critere, UpdateEvaluationPointDto} from "../models/critere";

@Injectable({
  providedIn: 'root'
})
export class CritereService {
  API_URL="http://localhost:3000/evaluation-points"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getAllCriteres(type:string):Observable<Critere[]>{
    const url = `${this.API_URL}`;
    const headers = this.getHeaders();
    return this.http.get<Critere[]>(url, { headers });
  }
  getCritereByID(id:number):Observable<Critere>{
    const url = `${this.API_URL}/${id}`;
    console.log(`${this.API_URL}/${id}`)
    const headers = this.getHeaders();
    const x =this.http.get<Critere>(url, { headers });
    console.log(x)
    return x;
  }
  updateCritere(id: number,critereData:UpdateEvaluationPointDto):Observable<any>{
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    return this.http.put<UpdateEvaluationPointDto>(url, critereData, { headers });
  }
  deleteCritere(id: number): Observable<{ message:string }> {
    const url = `${this.API_URL}/force/${id}`;
    const headers = this.getHeaders();
    return this.http.delete<{ message:string }>(url, { headers });
  }
  createCritere(critereData: { description:string,type:string}): Observable<any> {
    const url = `${this.API_URL}`
    const headers = this.getHeaders();
    return this.http.post<any>(url, critereData, { headers });
  }
}
