import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Shop } from '../../models/shop';
import { ShopService } from '../../services/shop.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductHubService } from '../../services/product-hub.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrl: './adminhome.component.css',
})

export class AdminhomeComponent implements OnInit {

  products:Shop[]=[];
  productId: number=0;
  showEditModal:boolean=false;
  loader:boolean=true;
  product:Shop={
    productName : '',
    description : '',
    price : 0,
  }
  id:number=0;
 
  constructor(private service: ShopService, private cartService: CartService, private authService: AuthService, private router:Router, private productHub: ProductHubService) { }
 
  async ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.id = userId ? +userId : 0;
    this.loadProducts();
    
    try {
      await this.productHub.startConnection();
      console.log('SignalR connection started successfully');
    } catch (err) {
      console.error('SignalR connection FAILED:', err);
    }
  
    this.productHub.onProductEvent((eventType, body) => {
      console.log('Live event received:', eventType, body);
      this.loadProducts();
    });
  }

  loadProducts()
  {
    this.service.getProductsbyUserId(this.id).subscribe((response) => {
      this.products = response;
      this.loader=false;
      console.log(this.products);
    });
  }

  deleteProduct(productId:number){
    this.productId=productId;
      this.service.getProductbyId(this.productId).subscribe((data)=>{
        this.product=data;
      });
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this Product? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'grey',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirm();
          Swal.fire({
            toast:true,
            position:'top',
            showConfirmButton:false,
            icon: 'success',
            timerProgressBar:false,
            timer: 4000,
            title: 'Deleted!',  
          }
          ).then((result)=>{
            this.loadProducts();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            toast:true,
            position:'top',
            showConfirmButton:false,
            icon: 'error',
            timerProgressBar:false,
            timer: 5000,
            title: 'Cancelled! Item is safe.',      
          });
        }
      });
  }

  updateProduct(id: number): void {
    this.router.navigate([`/add/${id}`])
  }

 
  confirm(): void {
    this.service.deleteProduct(this.productId).subscribe(()=>
      this.loadProducts()
    );
    this.cartService.deleteCart(this.productId).subscribe(()=>
      this.loadProducts()
    );
  }

  cancel(): void {
    this.showEditModal=false;
  }

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
  
  save()
  {
    this.service.updateProduct(this.productId, this.product).subscribe(
      (response)=>{
          this.showEditModal=false;
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'success',
            timerProgressBar:false,
            timer: 2000,
            title: 'Updated successfully',
          }).then(()=>{
            this.loadProducts();
          });
      }
    )
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}