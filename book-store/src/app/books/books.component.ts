import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book }  from '../models'
import { BooksService } from '../books.service';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit{
  books !: Book[];
  filteredBooks!: Book[];
  searchTerm: string = '';
  quantity: number = 1;
  loaded:boolean;

  constructor(private booksService: BooksService,
    private cartService: CartService
  ){
     this.loaded = false;
  }

  ngOnInit(): void {
    this.loaded = false;
   this.booksService.getBooks().subscribe((books:Book[]) => {
      this.books = books;
      this.filteredBooks = books;
      this.loaded = true;
      
   })
  }

  filterBooks(): void {
    if (!this.searchTerm.trim()) { 
      this.filteredBooks = [...this.books]; 
    } else {
      this.filteredBooks = this.books.filter(book => 
        book.title.toLowerCase().startsWith(this.searchTerm.toLowerCase())
      );
    }
  }
  addToCart(book: any) {
    if (this.quantity > 0) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(book);
      }
      alert(`${this.quantity} x "${book.title}" добавлено в корзину!`);
      this.quantity = 1;
    } else {
      alert('Введите корректное количество!');
    }
  }
}
