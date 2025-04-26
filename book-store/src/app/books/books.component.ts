import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../services/book.service'; 
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  imports: [CommonModule,RouterLink,FormsModule],
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const search = params['search'];
      if (search) {
        this.bookService.searchBooks(search).subscribe(data => {
          this.books = data;
        });
      } else {
        this.bookService.getBooks().subscribe(data => {
          this.books = data;
        });
      }
    });
  }
}