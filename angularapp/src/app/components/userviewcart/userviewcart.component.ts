import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';


@Component({
  selector: 'app-userviewcart',
  templateUrl: './userviewcart.component.html',
  styleUrl: './userviewcart.component.css',
})

export class UserviewcartComponent implements OnInit {

  carts:Cart[]=[];
  userId: number=0;
  cartId: number=0;
  isDeletePopupOpen = false;
  selectedProduct: Cart | null = null;
  productToDelete: Cart | null = null;

  unitcost:number=0;
  totalcost:number=0;

  @ViewChild('paymentRef', {static: true}) paymentRef!: ElementRef;
   
  constructor(private service: CartService, private payment: PaymentService, private authService: AuthService, private router:Router, private ngZone: NgZone) { }
    
  ngOnInit(): void {
    const user = localStorage.getItem('userId');
    if (user) {
    this.userId = +user;
    }
    console.log("User ID:", this.userId);
    this.loadProducts(this.userId);
    window.paypal.Buttons({style: {
      layout: 'horizontal',
      color: 'blue',
      shape: 'rect',
      label: 'paypal',
    },
    createOrder: (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: this.totalcost.toString(),
              currency_code: 'USD'
            }
          }
        ]
      });
    },
    onApprove: (data: any, actions: any) => {
      return actions.order.capture().then((details: any) => {
        if (details.status === 'COMPLETED') {
          this.service.clearCart(this.userId).subscribe(
            () => {
              Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            },
            (error) => {
              console.error("Error deleting product:", error);
            }
          );
          this.payment.transactionID = details.id;
          this.router.navigate(['order']);
        }
      });
    },
    onError: (error: any) => {
      console.log(error);
    }}).render(this.paymentRef.nativeElement);

  }

  loadProducts(userId: number): void {
    this.service.getProductsbyUserId(userId).subscribe(data => {
      this.carts = data;
      this.carts.forEach(cart => {
        console.log(cart.quantity);
        console.log(cart.price);
        if (cart.quantity !== undefined && cart.price !== undefined) {
          this.unitcost=cart.quantity*cart.price;
          this.totalcost+=this.unitcost;
        }  
      });
      console.log(this.unitcost);
      console.log(this.totalcost);
      console.log("Fetched Products:", this.carts);
    }, (error) => {
      console.error("Error fetching cart:", error);
    });
  }

  confirmDelete(cartId: number): void {
    this.cartId = cartId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct();
      }
    });
  }

  deleteProduct(): void {
    if (this.cartId) {
      this.service.deleteProduct(this.cartId).subscribe(
        () => {
          this.loadProducts(this.userId);
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        },
        (error) => {
          console.error("Error deleting product:", error);
        }
      );
      this.closeDeletePopup();
    }
  }

  closeDeletePopup(): void {
    this.isDeletePopupOpen = false;
    this.productToDelete = null;
  }

  closePopups(): void {
    this.closeDeletePopup();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  cancel() {
    this.router.navigate(['/usercart']);
  }

  searchTitle:string='';
  searchProduct(){
    if(this.searchTitle.trim().length!=0){
      this.carts=this.carts.filter(p=>{
        return p.productName?.toLowerCase().includes(this.searchTitle.toLowerCase());
      })
    }else{
      this.loadProducts(this.userId);
    }
  }

  proceedPayment(){
    this.router.navigate(['/order']);
    // this.service.clearCart(this.userId).subscribe(
    //   () => {
    //     Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
    //   },
    //   (error) => {
    //     console.error("Error deleting product:", error);
    //   }
    // );
  }

}