import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './customer';
import { environment } from '../environments/environment'; // Path to environment file

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = environment.apiUrl;
    private baseURL=`${this.apiUrl}/savecustomer`;
    private URL = `${this.apiUrl}/countcustomers`;
    private countURL = `${this.apiUrl}/counttransactions`;
  constructor(private httpClient: HttpClient) { }
  createCustomer(customer: Customer): Observable<Object>{
    return this.httpClient.post(`${this.baseURL}`, customer);
  }
  getCustomersList(): Observable<Customer[]>{
    return this.httpClient.get<Customer[]>(`${this.baseURL}`);
  }
  deleteCustomer(transactionId: number): Observable<void>{ 
    return this.httpClient.delete<void>(`${this.baseURL}/${transactionId}`)
  }
  countCustomers(id: number): Observable<number>{
    return this.httpClient.get<number>(`${this.URL}?id=${id}`);
  }
  countTransactionsForCustomer(id: number): Observable<number>{
    return this.httpClient.get<number>(`${this.countURL}?id=${id}`);
  }
}
