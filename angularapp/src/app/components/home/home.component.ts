import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {

  constructor(private authService:AuthService) { }
    
    userRole: string | null = '';
   
    ngOnInit() {
      this.userRole = localStorage.getItem('userRole');
    }
   
    
  
    isAdmin()
    {
      return localStorage.getItem('role')==='Admin';
    }
  
    isUser()
    {
      return localStorage.getItem('role')==='User';
    }
    
    isLoggedIn()
    {
      return this.authService.isLoggedIn();
    }

}