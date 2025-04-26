
toggleFavorite() {
  const bookId = this.book.id;
  this.favoritesService.addFavorite(bookId).subscribe(() => {
    this.isFavorite = true;
  });
}
