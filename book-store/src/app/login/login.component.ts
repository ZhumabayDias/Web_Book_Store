import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  flag = true;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const body = { username: this.username, password: this.password };
    this.http.post<any>('http://localhost:8000/api/token/', body).subscribe({
      next: (res: any) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Login failed');
      },
    });
  }

  onRegister() {
    const body = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    this.http.post<any>('http://localhost:8000/api/register/', body).subscribe({
      next: (res: any) => {
        console.log('Registration successful', res);
        alert('Registration successful! Now you can log in.');
        this.flag = true;
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMessage = 'Registration failed: ' + (err.error.detail || 'Unknown error');
      },
    });
  }

  switchToRegister() {
    this.flag = false;
  }

  switchToLogin() {
    this.flag = true;
  }
}