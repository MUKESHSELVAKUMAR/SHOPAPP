import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ShopService } from '../../services/shop.service';
import { Shop } from '../../models/shop';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shophome',
  templateUrl: './shophome.component.html',
  styleUrl: './shophome.component.css',
})

export class ShophomeComponent implements OnInit {

  productForm: FormGroup;
  products: Shop[]=[];
  loader:boolean=true;
  cart:Cart={
    cartId: 0,
    productId: 0,
    productName : '',
    description : '',
    price : 0,
    quantity: 0,
    UserId: 0
  };
  selectedProduct : Shop = {
    productId: 0,
    productName: '',
    description: '',
    price: 0,
    UserId: 0
  };
  displayProductForm : boolean = false;
  emptyMsg:string='';
  successMsg : string = '';

  id:number=0;
  show:boolean = false;

  constructor(private service: ShopService, private cartService: CartService, private builder:FormBuilder, private router:Router, private activateRoute: ActivatedRoute, private http: HttpClient) {
    this.productForm=builder.group({
      quantity:builder.control("",[Validators.required, Validators.min(1)])
    })
   }
   
  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.id = +userId;
    } else {
      this.id = 0;
    }
    console.log("id: " + this.id);
    this.loadProducts();
    
  }
  
  loadProducts():void{
    this.service.getAllProducts().subscribe(
      res=>{
        this.products=res;
        this.loader=false;
      },
      error => {
        console.error('Error loading product:', error);
      }
    )
  }

  public get quantity(){
    return this.productForm.get("quantity");
  }

  public showProduct(productId:number){
    this.service.getProductbyId(productId).subscribe(data=>{
      this.selectedProduct=data;
      console.log("product"+JSON.stringify(this.selectedProduct));
     
    });
    this.show=true;
  }

  async addProductCart(product:Shop) {
    if(this.productForm.valid){
      this.selectedProduct=product;
      this.selectedProduct.UserId=this.id;
      console.log("called service");
      this.cartService.getProductsbyUserId(this.id).subscribe(cartItems => {
        const existingProduct = cartItems.find((item: Cart) => item.productName === this.selectedProduct.productName);
  
        if (existingProduct) {
          // If product exists, update its quantity
          existingProduct.quantity += this.productForm.value.quantity;
          this.cartService.updateProduct(existingProduct.cartId,existingProduct).subscribe((result) => {
            this.cart = result;
          });
        } else {
          // If product does not exist, add it to the cart
          this.cart = {
            productId:this.selectedProduct.productId,
            productName: this.selectedProduct.productName,
            description: this.selectedProduct.description,
            price: this.selectedProduct.price,
            quantity: this.productForm.value.quantity,
            UserId: this.selectedProduct.UserId
          };
  
          this.cartService.addProductToCart(this.cart).subscribe((result) => {
            this.cart = result;
          });
        }
  
        Swal.fire({
          title: 'Success!',
          text: 'Product successfully added or updated.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/usercart'])
        });
  
      });
    }
  }
  
  // async addProductCart(product:Shop) {
  //   if(this.productForm.valid){
  //     this.selectedProduct=product;
  //     this.selectedProduct.UserId=this.id;
  //     console.log("called service");
  //     if(this.selectedProduct.productName != this.cart.productName){

  //       this.cart = {
  //         productId: this.selectedProduct.productId,
  //         productName : this.selectedProduct.productName,
  //         description : this.selectedProduct.description,
  //         price : this.selectedProduct.price,
  //         quantity : this.productForm.value.quantity,
  //         UserId : this.selectedProduct.UserId
  //       };
  
  //       this.cartService.addProductToCart(this.cart).subscribe((result) => {
  //       this.cart=result;

  //       });
  //       Swal.fire({
  //         title: 'Success!',
  //         text: 'Product successfully added.',
  //         icon: 'success',
  //         confirmButtonText: 'OK'
  //       }).then(() => {
  //         this.router.navigate(['/usercart'])
  //       })
  //       }
  //     }
  //     else{
  //       this.cart.quantity=this.productForm.value.quantity;
  //     }  
  // }

  searchTitle:string='';
  searchProduct(){
    if(this.searchTitle.trim().length!=0){
      this.products=this.products.filter(p=>{
        return p.productName?.toLowerCase().includes(this.searchTitle.toLowerCase());
      })
    }else{
      this.loadProducts();
    }
  }

  closeModal(){
    this.selectedProduct = {};
    this.displayProductForm = false;
    this.show = false;
  }
  
}