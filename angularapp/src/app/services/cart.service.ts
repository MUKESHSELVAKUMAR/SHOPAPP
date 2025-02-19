import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private backendUrl = environment.backendUrl;

  constructor(private http:HttpClient) { }
    
  public getProductsbyUserId(userId:number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/Cart/user/${userId}`);
  }

  public addProductToCart(cart:Cart): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/api/Cart/`, cart);
  }

  public updateProduct(cartId:number, cart:Cart):Observable<any>{
      return this.http.put<any>(`${this.backendUrl}/api/Cart/${cartId}`, cart);
  }

  public deleteProduct(cartId:number):Observable<any>{
    return this.http.delete<any>(`${this.backendUrl}/api/Cart/${cartId}`);
  }

  public deleteCart(productId:number):Observable<any>{
    return this.http.delete<any>(`${this.backendUrl}/api/Cart/product/${productId}`);
  }
  
  public clearCart(userId: number): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/api/Cart/${userId}`,{});
  }
  
}