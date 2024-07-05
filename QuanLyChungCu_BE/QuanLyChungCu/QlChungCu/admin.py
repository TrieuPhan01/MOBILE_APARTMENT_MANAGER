from django.contrib import admin
from django.utils.html import mark_safe
from .models import *
from django.urls import reverse
from django.utils.html import format_html
from .form import *
from django.urls import path
from django.db.models import Count
from django.template.response import TemplateResponse
from django.forms import Textarea
from django.shortcuts import get_object_or_404, redirect


class UserResidentSet(admin.ModelAdmin):
    list_display = ['id', 'username', 'change_password_required', 'avatar_acount', 'edit']
    search_fields = ['username']
    fieldsets = (
        (None, {'fields': ('username', 'password', 'user_role', 'email')}),
        ('Permission', {'fields': ('is_staff', 'is_active', 'is_superuser', 'user_permissions')}),
        ('Personal info', {'fields': ('change_password_required', 'avatar_acount')}),
    )

    ordering = ('id',)
    filter_horizontal = ()
    readonly_fields = ('my_avatar_acount',)

    def my_avatar_acount(self, user):
        if User.avatar_acount:
            return mark_safe(f"<img width='200' src='{user.avatar_acount.url}' />")

    def get_queryset(self, request):
        # Lấy queryset gốc
        queryset = super().get_queryset(request)
        # Lọc chỉ các người dùng có vai trò là Resident
        return queryset.filter(user_role=User.EnumRole.RESIDENT)

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)

    # class Media:
    #     # Viết css cho trang
    #     css = {
    #         'all': ('/static/css/styleAcount.css',)
    #     }
    # ietses js cho trang

    # js = ('/satic/......', )

    def save_model(self, request, obj, form, change):
        # Kiểm tra xem có phải là tạo mới đối tượng không
        if not change:
            # Nếu là tạo mới, đặt is_staff và is_superuser thành False
            obj.is_staff = False
            obj.is_superuser = False
        # Lưu đối tượng
        obj.save()


class CarCardSet(admin.ModelAdmin):
    list_display = ['id', 'area', 'status_card', 'vehicle_type', 'user', 'edit', ]
    search_fields = ['id', 'area']

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class PeopleSet(admin.ModelAdmin):
    list_display = ['id', 'name_people', 'sex', 'phone', 'birthday', 'ApartNum','user', 'edit']
    search_fields = ['id', 'name_people']

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class GoodsInlineAdmin(admin.StackedInline):
    model = Goods
    fk_name = 'box'


class BoxSet(admin.ModelAdmin):
    inlines = [GoodsInlineAdmin, ]
    list_display = ['id', 'stand', 'describe', 'box_status', 'user_admin', 'edit', ]
    search_fields = ['id', 'stand']

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class GoodSet(admin.ModelAdmin):
    list_display = ['id', 'name_goods', 'received_Goods', 'box', 'note', 'username', 'edit']
    search_fields = ['id', 'name_goods']
    readonly_fields = ('show_img_goods',)

    def show_img_goods(self, obj):
        if obj.img_goods:
            return mark_safe(f"<img width='200' src='{obj.img_goods.url}' />")

    def username(self, obj):
        if obj.box and obj.box.user_admin:
            return obj.box.user_admin.username
        return ""

    def show_image(self, obj):
        if obj.img_goods:
            return mark_safe(f"<img width='200' src='{obj.img_goods.url}' />")

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class BillSet(admin.ModelAdmin):
    list_display = ['id', 'name_bill', 'money', 'decription', 'type_bill', 'status_bill', 'user_resident', 'edit']
    search_fields = ['id', 'name_bill']

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class LettersSet(admin.ModelAdmin):
    list_display = ['id', 'title_letter', 'people', 'edit']
    search_fields = ['id', 'title_letter']
    form = LettersForm

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "user_admin":
            kwargs["queryset"] = User.objects.filter(user_role="Admin")
        return super().formfield_for_manytomany(db_field, request, **kwargs)

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)

    class myAdminStyle(admin.AdminSite):
        site_header = 'iStats'

        def get_urls(self):
            return [path('revenue-stats/', self.stats_view)] + super().get_urls()

        def stats_view(self, request):
            stats = Bill.objects.annotate(counter=Count('Bill__id')).values('id', 'name_bill', 'money')
            return TemplateResponse(request, 'admin/stats.html', {
                'stats': stats
            })

        pass



class LongTextFieldInline(admin.TabularInline):
    model = Question
    extra = 1
    formfield_overrides = {
        models.CharField: {'widget': Textarea(attrs={'rows': 3, 'cols': 150})}, # Điều chỉnh số dòng và cột cho ô nhập liệu
    }


class SurveyResponseInline(admin.TabularInline):
    model = SurveyResponse
    extra = 0
    readonly_fields = ('respondent', 'completed', 'timestamp')

class SurveyAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_surveyor', 'note', 'start_date', 'end_date',)
    inlines = [LongTextFieldInline, SurveyResponseInline]



class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 0
    readonly_fields = ('question', 'score')

class SurveyResponseAdmin(admin.ModelAdmin):
    list_display = ('survey', 'respondent', 'completed', 'timestamp')
    list_filter = ('completed', 'timestamp')
    inlines = [AnswerInline]


admin.site.register(User, UserResidentSet)
admin.site.register(People, PeopleSet)
admin.site.register(CarCard, CarCardSet)
admin.site.register(Box, BoxSet)
admin.site.register(Goods, GoodSet)
admin.site.register(Letters, LettersSet)
admin.site.register(Bill, BillSet)

admin.site.register(Survey, SurveyAdmin)
admin.site.register(SurveyResponse, SurveyResponseAdmin)

