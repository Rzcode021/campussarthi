from rest_framework import serializers
from django.db.models import Avg
from .models import CrewMember, CrewRating, PlacementFamilyMember
from accounts.serializers import UserSerializer


class CrewMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    total_ratings = serializers.SerializerMethodField()

    class Meta:
        model = CrewMember
        fields = ['id', 'user', 'title', 'department', 'bio', 'is_active', 'avg_rating', 'total_ratings']

    def get_avg_rating(self, obj):
        avg = obj.ratings.aggregate(Avg('stars'))['stars__avg']
        return round(avg, 1) if avg else 0.0

    def get_total_ratings(self, obj):
        return obj.ratings.count()


class CrewRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrewRating
        fields = ['id', 'crew_member', 'rated_by', 'stars', 'comment', 'updated_at']
        read_only_fields = ['rated_by']


class PlacementFamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementFamilyMember
        fields = '__all__'
