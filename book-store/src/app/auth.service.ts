import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/token/';
  private refreshUrl = 'http://127.0.0.1:8000/api/token/refresh/';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ access: string; refresh: string }> {
    return this.http.post<{ access: string; refresh: string }>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access);
        localStorage.setItem('refresh', response.refresh);
        this.tokenSubject.next(response.access);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  refreshToken(): Observable<{ access: string }> {
    const refresh = localStorage.getItem('refresh');
    return this.http.post<{ access: string }>(this.refreshUrl, { refresh }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access);
        this.tokenSubject.next(response.access);
      })
    );
  }
}