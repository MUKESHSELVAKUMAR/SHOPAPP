import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  public apiUrl=environment.backendUrl;
  private userRoleSubject = new BehaviorSubject<string>('');
  private userIdSubject = new BehaviorSubject<number>(0);
 
  constructor(private http:HttpClient) { }
 
  register(user:User):Observable<any>
  {
    console.log(user);
    return this.http.post<any>(`${this.apiUrl}/api/register`,user);
  }
 
  login(login:Login):Observable<any>
  {
    return this.http.post<any>(`${this.apiUrl}/api/login`, login).pipe(
      tap(response => {
        if (response && response.token) {
          console.log(response.token);
          localStorage.setItem('authToken', response.token);
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
          
          localStorage.setItem('userRole', tokenPayload.role);
          this.userRoleSubject.next(tokenPayload.role);
          this.userIdSubject.next(tokenPayload.userId);
        }
      })
    );
  }

  isRole() {
    const token = localStorage.getItem("Token");
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        try {
          let payload = JSON.parse(atob(tokenParts[1]));
          localStorage.setItem('userRole', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
          localStorage.setItem('userName', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
          localStorage.setItem('userId', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
          localStorage.setItem('userEmail', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
        } catch (e) {
          console.error("Failed to decode token payload", e);
        }
      } else {
        console.error("Token format is invalid");
      }
    } else {
      console.error("Token not found");
    }
  }
  

  get userRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  get userId(): Observable<number> {
    return this.userIdSubject.asObservable();
  }
 
  isLoggedIn()
  {
    if(localStorage.getItem('userRole')==="Admin" || localStorage.getItem('userRole')==="User")
    {
      return true;
    }
    return false;
  }
 
  isAdmin()
  {
    return localStorage.getItem('userRole')==="Admin";
  }
 
  isUser()
  {
    return localStorage.getItem('userRole')==="User";
  }
 
  logout()
  {
    localStorage.clear();
    console.log("logged out");
  }
}