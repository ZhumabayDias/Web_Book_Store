from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta : 
        verbose_name_plural = 'Categories' ; 


class Book(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(decimal_places=2,max_digits=8)
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name='books')
    cover = models.ImageField(upload_to='book_covers/', null=True, blank=True)

    def __str__(self):
        return self.title


class Order(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"
    


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.book.title} x{self.quantity}"
    


class Review(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE,related_name="reviews")
    rating = models.IntegerField()
    comment = models.TextField(blank=True)

    class Meta:
        unique_together = ['user', 'book']

    def __str__(self):
        return f"{self.user.username} - {self.book.title}: {self.rating}"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE,)
    book = models.ForeignKey(Book, on_delete = models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ['user', 'book'] 

    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.quantity})"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='favorited_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'book']

    def __str__(self):
        return f"{self.user.username} ♥ {self.book.title}"