import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './book-details/book-details.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {path: '', redirectTo:'home', pathMatch: 'full'},
    {path: 'home', component:HomeComponent, title: 'Home'},
    {path: 'books', component: BooksComponent, title: "Books"},
    {path: 'books/:id', component: BookDetailComponent, title: "Book-detail"},
    {path: 'login', component: LoginComponent, title: "Login"},
    {path: 'cart', component: CartComponent, title: "Cart"},
    {path: 'favorites', component:FavoritesComponent, title: "Favorites" },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [() => {
          const token = localStorage.getItem('access');
          return !!token; // true -> доступ есть, false -> перенаправляет
        }]
      }
];
