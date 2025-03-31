import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Book } from '../models';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-book-details',
  imports: [CommonModule,RouterModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDatailComponent {
  book !: Book;
  books !: Book[];
  loaded: boolean;
  @ViewChild('myInput') myInputRef!: ElementRef;

  constructor(private route:ActivatedRoute,
    private bookService:BooksService,
    private location: Location
  ){
    this.loaded = false;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bookID = Number(params.get('id'));
      this.loaded = false;
      this.bookService.getBook(bookID).subscribe((book: Book) => {
        this.book = book;
        this.loaded = true;
       });

    });

  }

  toReturn(){
    this.location.back();
  }

  previousImage() {
    const index = this.book.images.indexOf(this.book.selectedImage ?? '');
    this.book.selectedImage = this.book.images[(index - 1 + this.book.images.length) % this.book.images.length];
  }
  
  nextImage() {
    const index = this.book.images.indexOf(this.book.selectedImage ?? '');
    this.book.selectedImage = this.book.images[(index + 1) % this.book.images.length];
  }


}


