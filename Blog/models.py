from django.db.models.signals import pre_save
from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()


class Blog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    content = models.TextField()
    date_create = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)
    view = models.IntegerField(default=0)
    slug = models.SlugField(unique=True)

    def __str__(self) -> str:
        return self.title


def createSlug(instance, new_slug=None):
    slug = slugify(instance.title)
    if new_slug is not None:
        slug = new_slug
    b = Blog.objects.filter(slug=slug).order_by('-id')
    exists = b.exists()
    if exists:
        new_slug = '%s-%s' % (slug, b.first().id)
        return createSlug(instance, new_slug=new_slug)
    return slug


def pre_save_blog(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = createSlug(instance)


pre_save.connect(pre_save_blog, sender=Blog)
