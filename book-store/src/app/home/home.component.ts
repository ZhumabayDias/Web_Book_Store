import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, FooterComponent,RouterLink],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      const search = params['search'];

      // Если указан category
      if (categoryId) {
        this.http.get<any[]>('http://127.0.0.1:8000/api/catalog/').subscribe(data => {
          const category = data.find(c => c.id == categoryId);
          this.books = category ? category.books : [];
        });

      // Если указан search
      } else if (search) {
        this.http.get<any[]>(`http://127.0.0.1:8000/api/books/?search=${search}`).subscribe(
          data => this.books = data,
          error => console.error('Ошибка при поиске книг', error)
        );

      // Если ничего не указано — показать все книги
      } else {
        this.http.get<any[]>('http://127.0.0.1:8000/api/books/').subscribe(
          data => this.books = data,
          error => console.error('Ошибка при загрузке книг', error)
        );
      }
    });
  }
}