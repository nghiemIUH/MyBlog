import os
from django.db.models.signals import pre_save
from django.db import models
from django.template.defaultfilters import slugify
from multiselectfield import MultiSelectField
from django.dispatch import receiver


MY_CHOICES = (('Công nghệ thông tin', 'Công nghệ thông tin'),
              ('Điện tử', 'Điện tử'),
              ('Cơ khí', 'Cơ khí'),
              ('Khoa học máy tính', 'Khoa học máy tính'),
              ('Phần mềm', 'Phần mềm'))


class Document(models.Model):
    title = models.CharField(max_length=500)
    content = models.TextField(blank=True)
    date_create = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)
    file = models.FileField(upload_to='document')
    slug = models.SlugField(unique=True)
    tag = MultiSelectField(choices=MY_CHOICES)

    def __str__(self) -> str:
        return self.title


def createSlug(instance, new_slug=None):
    slug = slugify(instance.title)
    if new_slug is not None:
        slug = new_slug
    b = Document.objects.filter(slug=slug).order_by('-id')
    exists = b.exists()
    if exists:
        new_slug = '%s-%s' % (slug, b.first().id)
        return createSlug(instance, new_slug=new_slug)
    return slug


def pre_save_blog(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = createSlug(instance)


pre_save.connect(pre_save_blog, sender=Document)


@receiver(models.signals.post_delete, sender=Document)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)


@receiver(models.signals.pre_save, sender=Document)
def auto_delete_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_file = Document.objects.get(pk=instance.pk).file
    except Document.DoesNotExist:
        return False

    new_file = instance.file
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)
