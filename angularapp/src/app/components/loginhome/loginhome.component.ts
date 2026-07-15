import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginhome',
  templateUrl: './loginhome.component.html',
  styleUrls: ['./loginhome.component.css'],
})

export class LoginhomeComponent implements OnInit {

  role:string = '';

  Username:string = localStorage.getItem('userName') || '';

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole') || '';
  }
  
}