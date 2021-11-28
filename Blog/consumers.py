import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Blog, Comment, Reply
from channels.db import database_sync_to_async
from datetime import datetime


class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug']
        self.room_group_name = 'room_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        '''
            nhận message từ client
        '''
        data = json.loads(text_data)
        blog = await database_sync_to_async(Blog.objects.get)(slug=data['slug'])
        user = self.scope['user']

        comment = await database_sync_to_async(Comment.objects.create)(
            user=user,
            blog=blog,
            content=data['content'],
            date=datetime.now()
        )
        await database_sync_to_async(comment.save)()
        data = {
            'comment_id': comment.id,
            'user_avatar': user.avatar.url,
            'content': comment.content,
            'time': datetime.now().strftime('%d/%m/%Y')
        }
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_client',
                'message': data
            }
        )

    async def send_client(self, event):
        '''
            gửi lại thông tin cho client
        '''
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))
