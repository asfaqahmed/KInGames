from unittest import mock

from django.urls import reverse


class TestData:
    TEST_USERNAME = 'test_name'
    TEST_USER_PASSWORD = '12345678'

    TEST_GAMES_FIELDS = ['title', 'description', 'slug']

    TEST_CATEGORIES_DATA = [
        {
            'name': 'Strategy',
            'slug': 'strategy'
        },
        {
            'name': 'action',
            'slug': 'action'
        },
        {
            'name': 'adventure',
            'slug': 'adventure'
        }
    ]

    TEST_GAMES_DATA = [
        {
            'title': 'The Witcher 3',
            'description': 'Just some text around here',
            'price': '234.39',
            'slug': 'witcher3'
        },
        {
            'title': 'Test game',
            'description': 'Just some test text',
            'price': '222.39',
            'slug': 'test_game'
        },
        {
            'title': 'Another test game',
            'description': 'Just some text around here',
            'price': '333.00',
            'slug': 'another_test'
        },
        {
            'title': 'And another',
            'description': 'Just some test text',
            'price': '12.50',
            'slug': 'and_another_test'
        }
    ]


class APIUrls:
    GET_GAMES_URL = reverse('list_games')
    USER_CONFIG_URL = reverse('user')

    @staticmethod
    def SINGLE_GAME(slug):
        return reverse('single_game', args=[slug])


class TestAnswers:
    pass
