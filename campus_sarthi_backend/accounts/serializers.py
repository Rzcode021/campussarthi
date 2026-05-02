from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed('No account found with this email.')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password.')

        if not user.is_active:
            raise AuthenticationFailed('Account pending approval. Please wait for admin approval.')

        data = super().validate(attrs)
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['full_name'] = user.full_name
        token['is_staff'] = user.is_staff
        token['user_id'] = user.id
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'full_name', 'branch', 'year', 'phone']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(
            email=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
            branch=validated_data.get('branch', ''),
            year=validated_data.get('year', None),
            phone=validated_data.get('phone', ''),
            role='student',
            is_active=False,
        )
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'full_name', 'role', 'is_active', 'is_staff',
            'profile_photo', 'branch', 'year', 'phone', 'created_at'
        ]
        read_only_fields = ['id', 'email', 'is_staff', 'created_at']


class AdminUserSerializer(serializers.ModelSerializer):
    """Used by admin to update user role and active status."""
    class Meta:
        model = CustomUser
        fields = ['role', 'is_active']

    def update(self, instance, validated_data):
        new_role = validated_data.get('role', instance.role)
        instance.role = new_role
        # Crew must be active; keep student inactive/active as-is
        if new_role in ('crew', 'admin'):
            instance.is_active = True
        else:
            instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance
