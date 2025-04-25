import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Book } from '../models';
import { BooksService } from '../books.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  featuredBooks: Book[] = [];
  bestSellers: Book[] = [];
  recommendations: Book[] = [];
  categories: string[] = [];
  filteredBooks: Book[] = [];

  searchTerm: string = '';
  selectedCategory: string = 'All';
  loaded: boolean = false;

  constructor(private booksService: BooksService, private router: Router) {}

  ngOnInit(): void {
    this.booksService.getBooks().subscribe((books: Book[]) => {
      this.books = books;

      // Feature first 3 books
      this.featuredBooks = books.slice(0, 3);

      // Best sellers - sort by rating descending
      this.bestSellers = [...books]
        .filter(book => book.rating) // ensure book has a rating
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

      // Random recommendations
      this.recommendations = this.shuffleBooks([...books]).slice(0, 4);

      // Collect unique categories
      this.categories = ['All', ...new Set(books.map(book => book.category))];

      // Initially show all books
      this.filteredBooks = books;

      this.loaded = true;
    });
  }

  shuffleBooks(books: Book[]): Book[] {
    for (let i = books.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [books[i], books[j]] = [books[j], books[i]];
    }
    return books;
  }

  filterByCategory(): void {
    this.filteredBooks = this.selectedCategory === 'All'
      ? [...this.books]
      : this.books.filter(book => book.category === this.selectedCategory);

    this.applySearch(); // chain filter with search
  }

  applySearch(): void {
    if (this.searchTerm.trim()) {
      this.filteredBooks = this.filteredBooks.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSearchChange(): void {
    this.filterByCategory(); // includes search logic
  }

  goToBooks(): void {
    this.router.navigate(['/books']);
  }

  viewDetails(book: Book): void {
    this.router.navigate(['/book-details', book.id]);
  }
}
