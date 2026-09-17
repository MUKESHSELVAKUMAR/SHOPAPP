import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router:
      Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot):boolean{
    let role=localStorage.getItem('userRole')
      if (!role) {
        this.router.navigate(["/login"]);
        return false;
      }
      else{
        if(role=='Admin'){
          let currentUrl:string=this.router.getCurrentNavigation()?.extractedUrl.toString() ||'';
          if((currentUrl != "/adminproduct") &&  !(currentUrl.startsWith('/add'))){
            this.router.navigate(["/error"]);
            return false;
          }
        }else if(role=='User'){
          let currentUrl:string=this.router.getCurrentNavigation()?.extractedUrl.toString() ||'';
          if((currentUrl != "/userproduct") && (!currentUrl.startsWith('/usercart')) && (!currentUrl.startsWith('/order'))){
            this.router.navigate(["/error"]);
            return false;
          }
        }
 
        return true;
      }
  }
}