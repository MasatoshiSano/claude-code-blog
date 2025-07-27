from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('追加情報', {'fields': ('avatar', 'bio', 'articles_count')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('追加情報', {'fields': ('avatar', 'bio')}),
    )