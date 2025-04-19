from rest_framework import serializers
from .models import Book,Order,Category
from django.contrib.auth.models import User

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
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
