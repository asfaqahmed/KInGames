from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

from api.permissions import CommentManagePermission
from api.serializers import GetCommentSerializer, CreateUpdateCommentSerializer
from api.handlers import get_game_top_level_comments, get_top_level_comment_replies, delete_comment, get_comment_by_id


class TopLevelCommentsView(APIView):
    permission_classes = [CommentManagePermission]

    def get(self, request: Request, game_slug):
        comments = get_game_top_level_comments(game_slug)
        comments_serialized = GetCommentSerializer(comments, many=True)

        return Response(data=comments_serialized.data)

    def post(self, request: Request):
        request_data = dict(request.data)
        request_data['username'] = request.user.username

        comment_serialized = CreateUpdateCommentSerializer(data=request.data)
        if comment_serialized.is_valid():
            comment_serialized.save()
            return Response(data=comment_serialized.data)

        return Response(status=status.HTTP_400_BAD_REQUEST, data=comment_serialized.errors)


class ManageCommentView(APIView):
    permission_classes = [CommentManagePermission]

    def get(self, request: Request, pk):
        comments = get_top_level_comment_replies(pk)
        comments_serialized = GetCommentSerializer(comments, many=True)

        return Response(data=comments_serialized.data)

    def put(self, request: Request, pk):
        comment = get_comment_by_id(pk)
        comment_serialized = CreateUpdateCommentSerializer(comment, data=request.data)

        if comment_serialized.is_valid():
            return Response(data=comment_serialized.data)

        return Response(status=status.HTTP_400_BAD_REQUEST, data=comment_serialized.errors)

    def delete(self, request: Request, pk):
        delete_comment(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
