from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'detail/(?P<slug>.+)/$', consumers.CommentConsumer.as_asgi()),
]
