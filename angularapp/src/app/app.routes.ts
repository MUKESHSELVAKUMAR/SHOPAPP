import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginhomeComponent } from './components/loginhome/loginhome.component';
import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { ShophomeComponent } from './components/shophome/shophome.component';
import { UserviewcartComponent } from './components/userviewcart/userviewcart.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErrorComponent } from './components/error/error.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminaddprodComponent } from './components/adminaddprod/adminaddprod.component';
import { LogComponent } from './components/log/log.component';
import { OrderComponent } from './components/order/order.component';
import { AuthGuard } from './components/authguard/auth.guard';


export const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'reg',component:RegisterComponent},
  {path:'log',component:LogComponent},
  {path:'main',component:LoginhomeComponent},
  {path:'user/home',component:UsernavComponent},
  {path:'admin/home',component:AdminnavComponent},
  {path:'navbar',component:NavbarComponent},
  {path:'footer',component:FooterComponent},
  {path:'',redirectTo:'/home', pathMatch:'full'},
  //{path:'**', redirectTo:'/error',pathMatch:'full'},
  {path:'adminproduct',component:AdminhomeComponent, canActivate:[AuthGuard]},
  {path:'userproduct',component:ShophomeComponent, canActivate:[AuthGuard]},
  {path:'usercart',component:UserviewcartComponent, canActivate:[AuthGuard]},
  {path:'add',component:AdminaddprodComponent, canActivate:[AuthGuard]},
  {path:'add/:id',component:AdminaddprodComponent},
  {path:'order',component:OrderComponent},
  {path:'error',component:ErrorComponent}
  

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }