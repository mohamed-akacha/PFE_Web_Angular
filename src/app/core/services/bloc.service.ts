import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Bloc, CreateBlocDto} from "../models/Bloc";

@Injectable({
  providedIn: 'root'
})
export class BlocService {

  API_URL="http://localhost:3000/blocs"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getBlocs():Observable<Bloc[]>{
    const url = `${this.API_URL}`;
    const headers = this.getHeaders();
    return this.http.get<Bloc[]>(url, { headers });
  }
  getBlocsByUI(uiId:number):Observable<Bloc[]>{
    const url = `${this.API_URL}/units/${uiId}`;
    const headers = this.getHeaders();
    return this.http.get<Bloc[]>(url, { headers });
  }

  createBloc(blocData: CreateBlocDto):Observable<Bloc> {
    const url = `${this.API_URL}`
    const headers = this.getHeaders();
    return this.http.post<Bloc>(url,blocData,{headers})
  }
}
