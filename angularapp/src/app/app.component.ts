import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  constructor(private msalService: MsalService, private router: Router, private http:HttpClient) {}
 
  ngOnInit(): void {
    const accounts = this.msalService.instance.getAllAccounts();
     if (accounts.length > 0 && !this.msalService.instance.getActiveAccount()) {
      this.msalService.instance.setActiveAccount(accounts[0]);
    }

    this.msalService.handleRedirectObservable().subscribe({
    next: async (response) => {
      if (response && response.account) {
        this.msalService.instance.setActiveAccount(response.account);
        const tokenResponse = await this.msalService.instance.acquireTokenSilent({
          scopes: ['api://5f4e8beb-3a9d-4a31-8dd3-ffa432445c02/access_as_user'],
          account: response.account
        });
        console.log('SSO login');
  
        this.http.get<any>(`${environment.backendUrl}/api/sso-login`, {
          headers: { Authorization: `Bearer ${tokenResponse.accessToken}` }
        }).subscribe({
          next: (serverVerified) => {
            localStorage.setItem('userName', serverVerified.name ?? '');
            localStorage.setItem('userEmail', serverVerified.email ?? '');
            localStorage.setItem('userId', serverVerified.userId ?? '');
            localStorage.setItem('userRole', serverVerified.role.toLowerCase());
            localStorage.setItem('authMethod', 'sso');

            if (localStorage.getItem('userRole') === 'admin') {
              this.router.navigate(['main']);
            } else if (localStorage.getItem('userRole') === 'user') {
              this.router.navigate(['main']);
            } else {
              this.router.navigate(['home']);
            }

          },
          error: (err) => console.error('Server-side token validation failed:', err),
        });
      }
    },
      error: (error) => console.error('MSAL redirect error:', error),
    });
  }
}