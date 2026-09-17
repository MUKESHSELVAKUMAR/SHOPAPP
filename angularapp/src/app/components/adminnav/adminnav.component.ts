import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css'],
})

export class AdminnavComponent implements OnInit {

  Username : string = localStorage.getItem('userName') || '';

  constructor(private msalService: MsalService, private router:Router) { }

  ngOnInit(): void {
  }

  logoutAdmin(): void {
    const authMethod = localStorage.getItem('authMethod');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authMethod');
    localStorage.removeItem('token');
 
    if (authMethod === 'sso') {
      this.msalService.logoutRedirect({
        postLogoutRedirectUri: window.location.origin + '/log',
      });
    } else {
      this.router.navigate(['home']);
    }
  }

}