import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService:
    AuthService
    , private router:
      Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot):boolean{
    let role=localStorage.getItem('userRole')
      if (!role) {
        console.log("inside authguard method")
        this.router.navigate(["/login"]);
        return false;
      }
      else{
        console.log("inside else")
        console.log(role)
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