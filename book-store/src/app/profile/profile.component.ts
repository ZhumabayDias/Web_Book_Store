import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  template: `
    <div *ngIf="isAuthenticated">
      <h2>👤 Сәлем, {{ username }}</h2>
      <button (click)="logout()">Шығу</button>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  isAuthenticated = false;
  username = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('access');
    const name = localStorage.getItem('username');

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.isAuthenticated = true;
      this.username = name || 'Қолданушы';
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}