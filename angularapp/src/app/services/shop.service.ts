import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from '../models/shop';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private backendUrl = environment.backendUrl;
  httpParam : any;

  constructor(private http:HttpClient) { }

  public getAllProducts(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.backendUrl}/api/Shop`);
  }

  public getProductbyId(productId:number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/api/Shop/${productId}`);
  }

  public getProductsbyUserId(userId:number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/Shop/user/${userId}`);
  }

  public addProduct(product:Shop): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/api/Shop`, product);
  }

  public updateProduct(productId:number, product:Shop):Observable<any>{
    return this.http.put<any>(`${this.backendUrl}/api/Shop/${productId}`, product);
  }

  public deleteProduct(productId:number):Observable<any>{
    return this.http.delete<any>(`${this.backendUrl}/api/Shop/${productId}`);
  }

}