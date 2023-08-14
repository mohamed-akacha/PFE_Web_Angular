import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Evaluation} from "../models/Evaluation";

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  API_URL="http://localhost:3000/evaluations"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getEvaluationByInspecId(inspecId:number):Observable<Evaluation[]>{
    const url = `${this.API_URL}/byinst/${inspecId}`;
    const headers = this.getHeaders();
    return this.http.get<Evaluation[]>(url,{headers})
  }
}
