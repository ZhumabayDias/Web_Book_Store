import { Component, NgModule } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { FormsModule, NgModel } from '@angular/forms';
import { CategoryService } from './services/category.service';
import { BooksComponent } from './books/books.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet,RouterModule,CommonModule,BooksComponent,FormsModule],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  catalog: any[] = [];
  isDropdownOpen = false;

  constructor(private catalogService: CategoryService, private router: Router) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.catalog.length === 0) {
      this.catalogService.getCatalog().subscribe(
        data => this.catalog = data,
        err => console.error(err)
      );
    }
  }

  onCategorySelect(category: any) {
    this.router.navigate(['/home'], { queryParams: { category: category.id } });
  }

  searchQuery: string = '';

  searchBooks() {
    this.router.navigate(['/books'], {
      queryParams: { search: this.searchQuery }
    });
  }
}