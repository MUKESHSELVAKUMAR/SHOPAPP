import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  userId: number=0;
  carts:Cart[]=[];
  unitcost:number=0;
  totalcost:number=0;

  transactionId = "";

  constructor(private service: CartService, private authService: AuthService, private payment: PaymentService, private router:Router) { }

  ngOnInit(): void {
    const user = localStorage.getItem('userId');
    if (user) {
    this.userId = +user;
    }
    console.log("User ID:", this.userId);
    this.loadProducts(this.userId);

    this.transactionId = this.payment.transactionID;
  }

  loadProducts(userId: number): void {
    this.service.getProductsbyUserId(userId).subscribe(data => {
      this.carts = data;
      
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}