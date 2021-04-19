from rest_framework import serializers

from api.handlers import create_game, add_categories_for_game_creation
from api.models import Cart, CartGame, Game, KinGamesUser, User, Category, Comment
from api.utils.generate_slug import generate_slug_from_title


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'slug')


class GameCreateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('slug',)
        extra_kwargs = {
            'slug': {'validators': []},
        }


class KinUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = KinGamesUser
        fields = '__all__'
        extra_kwargs = {
            'django_user': {'validators': []},
        }


class UserSerializer(serializers.ModelSerializer):
    kin_user = KinUserSerializer(required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'kin_user')
        extra_kwargs = {'username': {'required': False}}


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = '__all__'


class GetGameSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    preview_image = serializers.ImageField()
    price = serializers.DecimalField(max_digits=7, decimal_places=2)
    slug = serializers.SlugField()
    is_wide = serializers.BooleanField()

    comments = CommentSerializer(many=True, required=False, allow_null=True)
    categories = CategorySerializer(many=True, required=False, allow_null=True)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class CreateGameSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=False)
    preview_image = serializers.ImageField(required=False, allow_null=True)
    price = serializers.DecimalField(max_digits=7, decimal_places=2, required=True)

    categories = GameCreateCategorySerializer(many=True, required=False)

    def create(self, validated_data: dict):
        categories_raw = validated_data.pop('categories', [])
        print(categories_raw)
        validated_data['slug'] = generate_slug_from_title(validated_data.get('title'))

        game = create_game(**validated_data)

        add_categories_for_game_creation(categories_raw, game)

        return game

    def update(self, instance, validated_data):
        pass


class UpdateGameSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(required=False)
    preview_image = serializers.ImageField(required=False, allow_null=True)
    price = serializers.DecimalField(max_digits=7, decimal_places=2, required=False)

    categories = CategorySerializer(many=True, required=False)

    def create(self, validated_data):
        pass

    def update(self, instance: Game, validated_data: dict):
        add_categories_for_game_creation(validated_data.pop('categories', []), instance)
        instance.__dict__.update(**validated_data)
        instance.save()

        return instance
