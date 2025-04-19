from .models import Book,Order,Category
from .serializers import BookSerializer,OrderSerializer,LoginSerializer,RegisterSerializer
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def book_list_create(request):
    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books,many = True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_staff:
            return Response({"Only admins can add books "}, status=403)
        serializer = BookSerializer(data = request.data)
        if(serializer.is_valid):
            serializer.save()
            return Response(serializer.data,status = 201)
        return Response(serializer.errors, status = 400)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data.copy()
    data['user'] = request.user.id
    serializer = OrderSerializer(data = data)
    if serializer.is_valid:
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

class BookDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        book = get_object_or_404(Book, id = pk)
        serializer = BookSerializer(Book)
        return Response(serializer.data)
    
    def put(self, request, pk):
        book = get_object_or_404(Book,id = pk)
        serializer = BookSerializer(book, data = request.data)
        if serializer.is_valid:
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
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'error': 'Invalid credentials'}, status=401)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out'}, status=200)
