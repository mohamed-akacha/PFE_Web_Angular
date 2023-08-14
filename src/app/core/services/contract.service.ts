import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Contract, UpdateContratDto,CreateContratDto} from "../models/contract"

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  API_URL="http://localhost:3000/contracts"
  constructor(private http:HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getAllContrats():Observable<Contract[]>{
    const url = `${this.API_URL}`;
    const headers = this.getHeaders();
    return this.http.get<Contract[]>(url, { headers });
  }
  getContratByID(id:number):Observable<Contract>{
    const url = `${this.API_URL}/${id}`;
    console.log(`${this.API_URL}/${id}`)
    const headers = this.getHeaders();
    const x =this.http.get<Contract>(url, { headers });
    console.log(x)
    return x;
  }
  updateContrat(id: number,ContratData:UpdateContratDto):Observable<any>{
    const url = `${this.API_URL}/${id}`;
    const headers = this.getHeaders();
    return this.http.put<UpdateContratDto>(url, ContratData, { headers });
  }
  deleteContrat(id: number): Observable<{ message:string }> {
    const url = `${this.API_URL}/force/${id}`;
    const headers = this.getHeaders();
    return this.http.delete<{ message:string }>(url, { headers });
  }
  createContrat(ContratData:CreateContratDto): Observable<Contract | { message: string }> {
    const url = `${this.API_URL}`
    const headers = this.getHeaders();
    return this.http.post<Contract | { message: string }>(url, ContratData, { headers });
  }



}
