import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stock } from './stock';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private url = "http://localhost:52035/";
  constructor(private httpClient: HttpClient) { }
  saveProductStock(ps: Stock): Observable<Stock>{
    return this.httpClient.post<Stock>(`${this.url}saveproductstock`, ps);
  }
  getAllProductStock(id: number): Observable<Stock[]> {
    return this.httpClient.get<Stock[]>(`${this.url}getallproductstock?id=${id}`);
  }
  deleteProduct(id: number): Observable<void>{
    return this.httpClient.delete<void>(`${this.url}deleteproduct?id=${id}`);
  }
  updateProduct(ps: Stock): Observable<Stock> {
    return this.httpClient.put<Stock>(`${this.url}updateproductstock`, ps);
  }
  findByProductNameForOwner(id: number, productName: string): Observable<Stock>{
    return this.httpClient.get<Stock>(`${this.url}findbyproductnameforowner?id=${id}&productName=${productName}`);
  }
}
