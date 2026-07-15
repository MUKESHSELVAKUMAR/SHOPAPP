import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup;

  ngOnInit(): void {
  }

  err:string="";
  
  constructor(private builder:FormBuilder, private authService:AuthService, private router:Router) {
    this.registerForm = builder.group({
      Username: builder.control("",Validators.required),
      Email: builder.control("",[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]),
      Password: builder.control("",[Validators.required,Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]),
      confirmPassword: builder.control("",Validators.required),
      PhoneNumber: builder.control("",[Validators.required,Validators.pattern(/^\d{10}$/)]),
      UserRole: builder.control("",Validators.required)
     },{validators:this.passwordMatchValidator})

   }

   public get Username(){
    return this.registerForm.get("Username");
  }

  public get Email(){
    return this.registerForm.get("Email");
  }

  public get Password(){
    return this.registerForm.get("Password");
  }

  public get confirmPassword(){
    return this.registerForm.get("confirmPassword");
  }

  public get PhoneNumber(){
    return this.registerForm.get("PhoneNumber");
  }

  public get UserRole(){
    return this.registerForm.get("UserRole");
  }
  
  passwordMatchValidator(form:FormGroup){
    return form.get('Password')?.value===form.get('confirmPassword')?.value?null:{mismatch:true};
  }

  registerUser(){
    if (this.registerForm.valid) {
     this.authService.register(this.registerForm.value).subscribe((res)=>{
       console.log(res);
       this.router.navigate(["/log"]);
       Swal.fire({
         title: 'Success!',
         text: 'Registration Successful!',
         icon: 'success',
         timer: 1500,
         showConfirmButton: false
       });
     },
     (error)=>{
       this.err=error.error;
       Swal.fire({
         title: 'Error!',
         text: 'Registration Failed. Please try again.',
         icon: 'error',
         timer: 1500,
         showConfirmButton: false
       });
     });
    }   
  }

}