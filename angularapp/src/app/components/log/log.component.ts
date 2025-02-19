import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrl: './log.component.css',
})

export class LogComponent {

  loginForm: FormGroup;

  role: string = '';
  showPassword: boolean = false;
 
  constructor(private authService: AuthService, private router: Router, private builder: FormBuilder) {
    this.loginForm = builder.group({
      email: builder.control("", [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]),
      password: builder.control("", Validators.required)
    });
   }
 
  ngOnInit(): void {
  }

  public get email(){
    return this.loginForm.get("email");
  }

  public get password(){
    return this.loginForm.get("password");
  }
 
  addlogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((res) => {
        console.log(res);
        localStorage.setItem("Token", res.token);
        this.authService.isRole();
        const storedRole = localStorage.getItem('userRole');
        if(storedRole){
          this.role = storedRole.toLowerCase();
        }
        console.log(this.role);
        Swal.fire({
          title: 'Success!',
          text: 'Login Successful!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          if (this.role === 'admin') {
            this.router.navigate(['main']);
          } else if (this.role === 'user') {
            this.router.navigate(['main']);
          } else {
            this.router.navigate(['home']);
          }
        });
  
      },
      error => {
        Swal.fire({
          title: 'Error!',
          text: 'Login Failed. Please try again.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
        });
      });
    }
  }
}