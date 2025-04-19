from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(decimal_places=2,max_digits=8)
    category = models.ForeignKey(Category,on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Order(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    book = models.ForeignKey(Book,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    ordered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"
    
