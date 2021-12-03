from django.shortcuts import render
from django.views import View
from . import models
# Create your views here.


def getDocument(request):
    docs = models.Document.objects.all()
    return render(request, 'doc/docList.html', {'docs': docs})


def getDocDetail(request, slug):
    doc = models.Document.objects.get(slug=slug)
    print(doc)
    return render(request, 'doc/docDetail.html', {'doc': doc})
