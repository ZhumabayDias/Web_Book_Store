import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = '';
  
  constructor(private client: HttpClient) { }

  getBook(id: number): Observable<Book>{
    return this.client.get<Book>(`http://127.0.0.1:8000/api/books/${id}`)
  }

  getBooks(): Observable<Book[]>{
    return this.client.get<Book[]>('http://127.0.0.1:8000/api/books/')
  }

  searchBooks(query: string): Observable<any[]> {
    return this.client.get<any[]>(`http://127.0.0.1:8000/api/books/?search=${query}`);
  }
}
