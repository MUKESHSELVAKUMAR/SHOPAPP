import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loginhome',
  templateUrl: './loginhome.component.html',
  styleUrls: ['./loginhome.component.css'],
})

export class LoginhomeComponent implements OnInit {

  role:string = '';

  Username:string = localStorage.getItem('userName') || '';

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole') || '';
  }
  
}