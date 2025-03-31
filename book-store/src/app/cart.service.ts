import { Injectable } from '@angular/core';
import { Book } from './models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private books: Book[] = [];
  private booksSubject = new BehaviorSubject<Book[]>(this.books);

  constructor() { }

  addToCart(book: Book) {
    this.books.push(book);
    this.booksSubject.next([...this.books]);
  }

  getBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  removeBook(book:Book) {
    this.books = this.books.filter(b => b !== book); 
    this.booksSubject.next([...this.books]); 
  }
}