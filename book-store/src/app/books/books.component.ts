import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from '../models';
import { BooksService } from '../books.service';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
previousImage() {
throw new Error('Method not implemented.');
}
nextImage() {
throw new Error('Method not implemented.');
}
toReturn() {
throw new Error('Method not implemented.');
}
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  sortOption: string = 'title';
  categories: string[] = [];
  quantityMap: { [bookId: string]: number } = {};
  loaded: boolean = false;

  // Optional pagination support
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;
  showPagination: boolean = false;
book: any;

  constructor(
    private booksService: BooksService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loaded = false;

    this.booksService.getBooks().subscribe((books: Book[]) => {
      this.books = books;

      // Extract categories from books
      this.categories = Array.from(new Set(books.map(book => book.category).filter(Boolean)));

      // Initialize quantity map
      books.forEach(book => this.quantityMap[book.id] = 1);

      this.applyFiltersAndSorting();
      this.loaded = true;
    });
  }

  filterBooks(): void {
    this.applyFiltersAndSorting();
  }

  sortBooks(): void {
    this.applyFiltersAndSorting();
  }

  applyFiltersAndSorting(): void {
    let books = [...this.books];

    // Filter by search term
    if (this.searchTerm.trim()) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (this.selectedCategory) {
      books = books.filter(book => book.category === this.selectedCategory);
    }

    // Sort
    switch (this.sortOption) {
      case 'price':
        books.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        books.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        books.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Pagination (optional)
    this.totalPages = Math.ceil(books.length / this.pageSize);
    this.showPagination = this.totalPages > 1;
    this.filteredBooks = books.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFiltersAndSorting();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFiltersAndSorting();
    }
  }

  addToCart(book: Book, quantity: number = 1): void {
    if (quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        this.cartService.addToCart(book);
      }
      alert(`${quantity} x "${book.title}" added to cart!`);
      this.quantityMap[book.id] = 1;
    } else {
      alert('Enter a valid quantity!');
    }
  }
}
