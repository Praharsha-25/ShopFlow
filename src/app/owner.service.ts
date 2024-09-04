import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Owner } from './owner';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
   private apiUrl = environment.apiUrl;
  
  
  private baseURL = `${this.apiUrl}/saveuser`;
  private URL = `${this.apiUrl}/getowner`;
  private dob= `${this.apiUrl}/getownerdob`;
  constructor(private httpClient: HttpClient) { }
  createOwner(owner: Owner): Observable<Owner>{
    return this.httpClient.post<Owner>(`${this.baseURL}`, owner);
  }
  getOwnersList(): Observable<Owner[]>{
    return this.httpClient.get<Owner[]>(`${this.baseURL}`);
  }
  getOwnerById(id: number): Observable<Owner>{
    return this.httpClient.get<Owner>(`${this.URL}?id=${id}`);
  }
  getDob(id: number): Observable<Date>{
    return this.httpClient.get<Date>(`${this.dob}?id=${id}`);
  }
}
