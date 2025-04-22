from django.urls import path
from .views import (
    register, book_list_create, create_order, BookDetailView,
    add_review, book_reviews, category_list_create, cart_items,
    user_profile, catalog_view, MyOrdersView
)

urlpatterns = [
    path('profile/', user_profile),
    path('register/', register),
    path('books/', book_list_create),
    path('books/<int:pk>/', BookDetailView.as_view()),
    path('books/<int:book_id>/review/', add_review),
    path('books/<int:book_id>/reviews/', book_reviews),
    
    path('categories/', category_list_create),
    path('cart/', cart_items),
    path('catalog/', catalog_view),
    
    path('orders/create/', create_order),
    path('orders/my/', MyOrdersView.as_view()), 
]