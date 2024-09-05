import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerTransactions } from './customer-transactions';

@Injectable({
  providedIn: 'root'
})
export class CustomerTransactionService {

  private baseURL="https://shopflowbackend-hsz6.onrender.com/savetransaction";
  private URL="https://shopflowbackend-hsz6.onrender.com/gettransactions";
  private countURL = "https://shopflowbackend-hsz6.onrender.com/countproducts";
  private revenueURL = "https://shopflowbackend-hsz6.onrender.com/totalrevenue";
  private trans = "https://shopflowbackend-hsz6.onrender.com/getalltransactions";
  private top4 = "https://shopflowbackend-hsz6.onrender.com/gettop4";
  private total = "https://shopflowbackend-hsz6.onrender.com/total";
  private week ="https://shopflowbackend-hsz6.onrender.com/weekrevenue";
  private topProducts = "https://shopflowbackend-hsz6.onrender.com/gettopproductlist";
  constructor(private  httpClient: HttpClient) { }
  createTransaction(transaction: CustomerTransactions): Observable<Object>{
    return this.httpClient.post(`${this.baseURL}`, transaction);
  }
  getTransactionsList(): Observable<CustomerTransactions[]>{
    return this.httpClient.get<CustomerTransactions[]>(`${this.baseURL}`);

  }
  deleteTransaction(transactionId: number): Observable<void>{ 
    return this.httpClient.delete<void>(`${this.baseURL}/${transactionId}`)
  }
  getTransactionsForOwner(id: number):Observable<CustomerTransactions[]>{
    return this.httpClient.get<CustomerTransactions[]>(`${this.URL}?id=${id}`);
  }
  getAllTransactionsForOwner(id: number): Observable<CustomerTransactions[]>{
    return this.httpClient.get<CustomerTransactions[]>(`${this.trans}?id=${id}`);
  }
  countProducts(id: number): Observable<number>{
    return this.httpClient.get<number>(`${this.countURL}?id=${id}`);
  }
  totalRevenue(id: number): Observable<number>{
    return this.httpClient.get<number>(`${this.revenueURL}?id=${id}`);
  }
  getTop4Products(id: number): Observable<[number, string][]>{
    return this.httpClient.get<[number, string][]>(`${this.top4}?id=${id}`);
  }
  totalProducts(id: number): Observable<number>{
    return this.httpClient.get<number>(`${this.total}?id=${id}`);
  }
  previousWeekRevenue(id: number): Observable<[number, Date][]>{
    return this.httpClient.get<[number,Date][]>(`${this.week}?id=${id}`);
  }
  topProductPerDayForOwner(id: number): Observable<[string,number,Date][]>{
    return this.httpClient.get<[string, number, Date][]>(`${this.topProducts}?id=${id}`);
  }
}
