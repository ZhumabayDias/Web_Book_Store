import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Book } from '../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  books: Book[] = [];
  loaded: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getBooks().subscribe((books: Book[]) => {
      this.books = books;
      this.loaded = true;
    });
  }

  remeveBook(book:Book){
    this.cartService.removeBook(book);
  }
}