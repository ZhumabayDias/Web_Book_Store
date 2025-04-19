from django.urls import path
from .views import register, login, logout, book_list_create, create_order, BookDetailView, MyOrdersView

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('logout/', logout),
    path('books/', book_list_create),
    path('books/<int:pk>/', BookDetailView.as_view()),
    path('orders/create/', create_order),
    path('orders/my/', MyOrdersView.as_view()),
]