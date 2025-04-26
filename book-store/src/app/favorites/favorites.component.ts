
import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule,RouterLink,FooterComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (data) => this.favorites = data,
      error: (err) => {
        if (err.status === 401) {
          alert('Пожалуйста, войдите в систему');
        }
      }
    });
  }
}
