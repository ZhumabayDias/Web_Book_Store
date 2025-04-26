from rest_framework import serializers
from .models import Book, Favorite,Order,Category,Review,Cart,OrderItem
from django.contrib.auth.models import User

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    def get_cover(self, obj):
        request = self.context.get('request')
        if obj.cover:
            return request.build_absolute_uri(obj.cover.url)
        return None
    


class OrderItemSerializer(serializers.Serializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ['id']



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'status', 'items']
        read_only_fields = ['user', 'created_at', 'status']


class BookMiniSerializer(serializers.ModelSerializer):
    cover = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'cover', 'price']

    def get_cover(self, obj):
        request = self.context.get('request')
        if obj.cover and request:
            return request.build_absolute_uri(obj.cover.url)
        return None




class CategoryCatalogSerializer(serializers.ModelSerializer):
    books = BookMiniSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'books']
        



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only = True)
    email = serializers.EmailField()

    def create(self,data):
        return User.objects.create_user(**data)
    


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user','book']



class CartSerializer(serializers.ModelSerializer):
    book = BookMiniSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), write_only=True, source='book')

    class Meta:
        model = Cart
        fields = ['id', 'book', 'book_id', 'quantity']

        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
       
        


class FavoriteSerializer(serializers.ModelSerializer):
    book = BookMiniSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'book', 'added_at']
        read_only_fields = ['user', 'added_at']