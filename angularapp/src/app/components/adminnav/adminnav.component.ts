import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css'],
})

export class AdminnavComponent implements OnInit {

  Username : string = localStorage.getItem('userName') || '';

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  public logoutAdmin(){
    localStorage.clear();
    this.router.navigate(['/home']);
  }

}