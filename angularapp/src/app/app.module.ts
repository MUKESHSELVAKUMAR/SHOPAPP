import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { ErrorComponent } from './components/error/error.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { LoginhomeComponent } from './components/loginhome/loginhome.component';
import { FooterComponent } from './components/footer/footer.component';
import { ShophomeComponent } from './components/shophome/shophome.component';
import { UserviewcartComponent } from './components/userviewcart/userviewcart.component';
import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './components/register/register.component';
import { AdminaddprodComponent } from './components/adminaddprod/adminaddprod.component';
import { LogComponent } from './components/log/log.component';
import { OrderComponent } from './components/order/order.component';

@NgModule({
  declarations: [
    AdminnavComponent,
    NavbarComponent,
    UsernavComponent,
    FooterComponent,
    OrderComponent,
    ErrorComponent,
    LoginhomeComponent,
    ShophomeComponent,
    UserviewcartComponent,
    AdminhomeComponent,
    HomeComponent,
    RegisterComponent,
    AdminaddprodComponent,
    OrderComponent,
    LogComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule.forRoot([]),
    AppComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }