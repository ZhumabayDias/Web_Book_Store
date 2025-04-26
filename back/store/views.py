from .models import Book, Favorite, Order, Category, Review, Cart, OrderItem
from .serializers import BookSerializer, FavoriteSerializer, OrderSerializer, LoginSerializer, RegisterSerializer, ReviewSerializer, CategoryCatalogSerializer, CartSerializer, ProfileSerializer, CategorySerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.generics import ListCreateAPIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_list_create(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    cart_items = Cart.objects.filter(user=request.user)
    if not cart_items.exists():
        return Response({'error': 'Your cart is empty.'}, status=400)

    order = Order.objects.create(user=request.user)

    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            book=item.book,
            quantity=item.quantity
        )
        item.delete()

    serializer = OrderSerializer(order, context={'request': request})
    return Response(serializer.data, status=201)


class BookDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        book = get_object_or_404(Book, id=pk)
        serializer = BookSerializer(book, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        book = get_object_or_404(Book, id=pk)
        serializer = BookSerializer(book, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        book = get_object_or_404(Book, id=pk)
        book.delete()
        return Response(status=204)


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User registered successfully'}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def add_review(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, book=book)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def book_reviews(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    reviews = book.reviews.all()
    serializer = ReviewSerializer(reviews, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def cart_items(request):
    if request.method == 'GET':
        items = Cart.objects.filter(user=request.user)
        serializer = CartSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        book_id = request.data.get('book')
        item = Cart.objects.filter(user=request.user, book_id=book_id).first()
        if item:
            item.delete()
            return Response({'message': 'Item removed from cart.'})
        return Response({'error': 'Item not found in cart.'}, status=404)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user

    if request.method == 'GET':
        serializer = ProfileSerializer(user, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProfileSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def catalog_view(request):
    categories = Category.objects.prefetch_related('books').all()
    serializer = CategoryCatalogSerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)


class BookListView(ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'category__name']
    ordering_fields = ['price']
    filterset_fields = ['category']


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def favorite_books(request):
    if request.method == 'GET':
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(user=request.user)
                return Response(serializer.data, status=201)
            except Exception as e:
                return Response({'error': str(e)}, status=400)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        book_id = request.data.get('book')
        favorite = Favorite.objects.filter(user=request.user, book_id=book_id).first()
        if favorite:
            favorite.delete()
            return Response({'message': 'Book removed from favorites.'})
        return Response({'error': 'Book not found in favorites.'}, status=404)