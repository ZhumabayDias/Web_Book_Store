import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BooksComponent } from './books/books.component';
import { BookDatailComponent } from './book-details/book-details.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
    {path: 'home', component:HomeComponent, title: 'Home'},
    {path: 'books', component: BooksComponent, title: "Books"},
    {path: 'books/:id', component: BookDatailComponent, title: "Book-detail"},
    {path: 'login', component: LoginComponent, title: "Login"},
    {path: 'cart', component: CartComponent, title: "Cart"}
];
