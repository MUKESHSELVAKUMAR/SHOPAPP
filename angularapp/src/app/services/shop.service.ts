import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from '../models/shop';
import { environment } from '../../environments/environment';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private backendUrl = environment.backendUrl;
  httpParam : any;

  constructor(private http:HttpClient, private msalService: MsalService) { }

  public getAllProducts(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.backendUrl}/api/Shop`);
  }

  public getProductbyId(productId:number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/api/Shop/${productId}`);
  }

  public getProductsbyUserId(userId:number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/Shop/user/${userId}`);
  }

  public async addProduct(product: Shop): Promise<any> {
  const account = this.msalService.instance.getActiveAccount();
  
  const tokenResponse = await this.msalService.instance.acquireTokenSilent({
    scopes: ['api://5f4e8beb-3a9d-4a31-8dd3-ffa432445c02/access_as_user'],
    account: account!
  });
 
  return this.http.post<any>(`${this.backendUrl}/api/Shop/admin`, product, {
    headers: { Authorization: `Bearer ${tokenResponse.accessToken}` }
  }).toPromise();
}

  public updateProduct(productId:number, product:Shop):Observable<any>{
    return this.http.put<any>(`${this.backendUrl}/api/Shop/${productId}`, product);
  }

  public deleteProduct(productId:number):Observable<any>{
    return this.http.delete<any>(`${this.backendUrl}/api/Shop/${productId}`);
  }

}