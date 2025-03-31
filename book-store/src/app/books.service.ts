import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './models';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
  
  constructor(private client: HttpClient) { }

  getBook(id: number): Observable<Book>{
    return this.client.get<Book>(`https://jsonplaceholder.typicode.com/albums/${id}`)
  }

  getBooks(): Observable<Book[]>{
    return this.client.get<Book[]>('https://jsonplaceholder.typicode.com/albums')
  }
}
