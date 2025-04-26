import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [CommonModule],
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  books: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/cart/')
      .subscribe(data => this.books = data);
  }

  createOrder() {
    this.http.post('http://127.0.0.1:8000/api/orders/create/', {})
      .subscribe({
        next: () => {
          alert('Тапсырыс сәтті жасалды! 🎉');
          this.books = []; // очищаем корзину
        },
        error: err => {
          console.error(err);
          alert('Тапсырыс жасау кезінде қате болды ❌');
        }
      });
  }

  removeBook(book: any) {
    this.http.request('delete', 'http://127.0.0.1:8000/api/cart/', {
      body: { book: book.id }
    }).subscribe(() => {
      this.books = this.books.filter(b => b.id !== book.id);
    });
  }

  addToCart(book: any) {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Алдымен жүйеге кіріңіз!');
      return;
    }
  
    this.http.post('http://127.0.0.1:8000/api/cart/', {
      book: book.id,
      quantity: 1
    }).subscribe({
      next: () => {
        alert('Кітап себетке қосылды ✅');
        this.loadCart();
      },
      error: (err) => {
        console.error(err);
        alert('Қате болды кітапты себетке қосқанда ❌');
      }
    });
  }

  getTotalPrice(): number {
    return this.books.reduce((total, item) => {
      const price = item?.book?.price ?? 0;
      const qty = item?.quantity ?? 1;
      return total + price * qty;
    }, 0);
  }
}