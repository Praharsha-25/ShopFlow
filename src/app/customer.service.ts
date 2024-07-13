import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
    private baseURL="http://localhost:52035/savecustomer";
    private URL = "http://localhost:52035/countcustomers";
    private countURL = "http://localhost:52035/counttransactions";
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
