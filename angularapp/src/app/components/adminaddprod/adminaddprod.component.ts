import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Shop } from '../../models/shop';
import { ShopService } from '../../services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminaddprod',
  templateUrl: './adminaddprod.component.html',
  styleUrl: './adminaddprod.component.css',
})

export class AdminaddprodComponent {

  newProduct : Shop = {
    productName : '',
    description : '',
    price : 0,
  }

  product:Shop[]=[]
  formSubmitted: boolean=false;
  constructor(private service:ShopService, private router:Router,private route:ActivatedRoute) { }
 
  id:number = 0;
  formError: boolean = false;
  showSuccessModal: boolean = false;
  isEditMode: boolean = false;
  titleExists: boolean = false;
  productId: number = 0;

  
  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.id = +userId;
    } else {
      this.id = 0;
    }
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProduct(this.productId);
      }
    });
    this.loadProducts();
  }
  loadProducts():void{
    this.service.getAllProducts().subscribe(
      res=>{
        this.product=res;
      },
      error => {
        console.error('Error loading product:', error);
      }
    )
  }

  loadProduct(id: number): void {
    this.service.getProductbyId(id).subscribe(
      res => {
        this.newProduct = res;
      
      },
      error => {
        console.error('Error loading product:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
     if (this.isEditMode) {
        this.updateProduct(form);
      } else {
        this.addProduct(form);
      }
    } else {
      this.formError = true;
    }
  }
  

  addProduct(form: any) {
    if (form.valid) {
      this.showSuccessModal = true;
      this.newProduct.UserId=this.id;
      this.service.addProduct(this.newProduct).subscribe((result) => {
      });
      Swal.fire({
        title: 'Success!',
        text: 'Product successfully added.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/adminproduct'])
      })
    }
  }

  cancelEdit(){
    this.router.navigate([`/adminproduct`]);
  }
 
 
  isUserDialogOpen: boolean = false;
  messageValue: string = "Added";
 
  openUserDialog(): void {
    this.isUserDialogOpen = true;
  }
 
  closeUserDialog(): void {
    this.isUserDialogOpen = false;
    this.formReset();
  }
 
  close() {
    this.router.navigate(['/adminproduct']);
  }

  updateProduct(form: NgForm): void {
    this.service.updateProduct(this.productId, this.newProduct).subscribe(() => {
    });
    Swal.fire({
      title: 'Success!',
      text: 'Product Updated.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate([`/adminproduct`])
    })
  }

  closeModal(): void {
    this.showSuccessModal = false;
    
    this.formError = false;
    this.titleExists = false;
  }
  formReset(){
    this.newProduct={
      productName : "",
      description : "",
      price : 0
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const product = this.newProduct as any;
    if (product[fieldName] == '' && this.formSubmitted == true) {
      return true;
    }
    else {
      return false;
    }
  }
  

  isFormValid():boolean{
    const data=['productName',
    'description',
    'price'];
    for(let item of data){
      if(this.isFieldInvalid(item) ){
        return false;
      }
    }
    return true;
  }

}