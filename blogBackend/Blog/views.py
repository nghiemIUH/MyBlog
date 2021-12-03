from django.core import paginator
from django.http.response import JsonResponse
from .models import Blog, Comment, Reply
from django.shortcuts import render
from django.views import View
import json
import datetime
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# Create your views here.


class BlogView(View):

    def get(self, request):
        blogs = Blog.objects.all().order_by('-date_create')
        page = request.GET.get('page', 1)
        paginator = Paginator(blogs, 10)
        try:
            blogs_page = paginator.page(page)
        except PageNotAnInteger:
            blogs_page = paginator.page(1)
        except EmptyPage:
            blogs_page = paginator.page(paginator.num_pages)
        top_blog = Blog.objects.all().order_by('-view')
        return render(request, 'blog/blog.html', {'blogs': blogs_page, 'top_blog': top_blog})


class WriteBlog(View):
    def get(self, request):
        return render(request, 'blog/write.html')

    def post(self, request):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        blog = Blog.objects.create(
            user=user,
            title=data['title'],
            content=data['content'],
        )
        blog.save()
        return JsonResponse(data={'message': 'oke'}, status=200)


def detail(request, slug):
    blog = Blog.objects.get(slug=slug)
    view = blog.view
    blog.view = view+1
    blog.save()
    return render(request, 'blog/blogDetail.html', {'blog': blog})


def edit(request, slug):
    blog = Blog.objects.get(slug=slug)
    return render(request, 'blog/edit.html', {'blog': blog})


class MyPost(View):
    def get(self, request):
        blogs = Blog.objects.filter(user=request.user)
        return render(request, 'blog/myPost.html', {'blogs': blogs})

    def put(self, request):
        data = json.loads(request.body.decode('utf-8'))
        blog = Blog.objects.filter(slug=data['slug'])
        blog.update(
            title=data['title'],
            content=data['content'],
            date_update=datetime.datetime.today()
        )
        # blog.save()
        # print(data['content'])
        return JsonResponse(data={'message': 'success'}, status=200)

    def delete(self, request):
        data = json.loads(request.body.decode('utf-8'))
        Blog.objects.get(pk=data['_id']).delete()
        return JsonResponse(data={'message': 'success'}, status=200)
