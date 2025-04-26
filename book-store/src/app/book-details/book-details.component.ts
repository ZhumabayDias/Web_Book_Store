import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-details',
  imports: [CommonModule, FooterComponent, FormsModule,RouterModule,RouterLink,RouterOutlet],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailComponent implements OnInit {
  book: any;
  reviews: any[] = [];
  newReview = { comment: '', rating: null };
  isAuthenticated = false;
  isFavorite = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.params['id'];
    this.fetchBook(bookId);
    this.fetchReviews(bookId);
    this.isAuthenticated = !!localStorage.getItem('access');
    this.checkIfFavorite(bookId);
  }

  fetchBook(id: number) {
    this.http.get(`http://127.0.0.1:8000/api/books/${id}/`).subscribe(data => this.book = data);
  }

  fetchReviews(id: number) {
    this.http.get<any[]>(`http://127.0.0.1:8000/api/books/${id}/reviews/`)
      .subscribe(data => this.reviews = data);
  }

  submitReview() {
    const bookId = this.route.snapshot.params['id'];
  
    this.http.post(`http://127.0.0.1:8000/api/books/${bookId}/review/`, this.newReview)
      .subscribe(() => {
        this.fetchReviews(bookId);
        this.newReview = { comment: '', rating: null };
      });
  }

  toggleFavorite() {
    const bookId = this.book.id;
  
    if (this.isFavorite) {
      this.http.request('delete', 'http://127.0.0.1:8000/api/favorites/', {
        body: { book_id: bookId }
      }).subscribe({
        next: () => this.isFavorite = false,
        error: (err) => {
          console.error('Ошибка удаления из favorites:', err);
          alert('Қате болды фавориттен жою кезінде ❌');
        }
      });
    } else {
      this.http.post('http://127.0.0.1:8000/api/favorites/', {
        book_id: bookId
      }).subscribe({
        next: () => this.isFavorite = true,
        error: (err) => {
          console.error('Ошибка добавления в favorites:', err);
          if (err.status === 400) {
            if (err.error && err.error.error === 'Book is already in favorites') {
              alert('Бұл кітап уже фаворитте!');
            } else {
              alert('Қате: ' + (err.error?.error || 'Белгісіз қате ❌'));
            }
          } else {
            alert('Қате болды фаворитке қосқанда ❌');
          }
        }
      });
    }
  }
  
  checkIfFavorite(bookId: number) {
    this.http.get<any[]>('http://127.0.0.1:8000/api/favorites/')
      .subscribe(data => {
        this.isFavorite = data.some(fav => fav.book.id === bookId || fav.book === bookId);
      });
  }

  addToCart() {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Алдымен жүйеге кіріңіз!');
      return;
    }
  
    this.http.post('http://127.0.0.1:8000/api/cart/', {
      book_id: this.book.id,
      quantity: 1
    }).subscribe({
      next: () => alert('Кітап себетке қосылды! ✅'),
      error: err => {
        console.error(err);
        if (err.status === 401) {
          alert('Сессия аяқталды. Қайта кіріңіз.');
        } else {
          alert('Қате болды кітапты себетке қосқанда ❌');
        }
      }
    });
  }
}