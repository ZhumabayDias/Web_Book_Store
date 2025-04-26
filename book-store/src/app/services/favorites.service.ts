
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/favorites/');
  }

  addFavorite(bookId: number): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/favorites/', { book: bookId });
  }
}
