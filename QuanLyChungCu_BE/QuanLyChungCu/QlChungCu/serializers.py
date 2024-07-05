# serializers chuyển dữ liệu phức tạp từ Queryset thành kiểu dữ liệu đơn gian như Json để chuyển ra bên ngoài
# Có nhiều cách khai báo serializer: + Không cần model
#                                   + liên kết với model: ở đây sử dụng cách này

from QlChungCu.models import People, User, CarCard, Box, Goods, Letters, Bill, Survey, Question, Answer, \
    SurveyResponse
from rest_framework import serializers
import random
import string
import smtplib
from email.mime.text import MIMEText



class CarCardSerializers(serializers.ModelSerializer):
    class Meta:
        model = CarCard
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = '__all__'


class UserSerializers(serializers.ModelSerializer):

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar_acount'] = instance.avatar_acount.url

        return rep

    class Meta:
        model = User
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = ['id', 'username', 'password', 'avatar_acount', 'change_password_required', 'email']

class AdminSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = ['id', 'username',]

#         extra_kwargs = {# các trường chí ghi chớ không đọc
#                 'pass_acount': {
#                     'write_only': 'True'
#                 },
#                 'admin': {
#                     'write_only': 'True'
#                 }
#         }

class UpdateResidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['password', 'avatar_acount', ]
        extra_kwargs = {
            'pass_acount': {
                'write_only': True
            }
        }


class BoxSerializers(serializers.ModelSerializer):
    class Meta:
        model = Box
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = ['id', 'stand', 'describe', 'box_status',]


class GoodsSerializers(serializers.ModelSerializer):
    img_goods = serializers.SerializerMethodField()

    def get_img_goods(self, obj):
        if obj.img_goods:
            return obj.img_goods.url
        return None

    class Meta:
        model = Goods
        fields = ['id', 'name_goods', 'received_Goods', 'note', 'box', 'size', 'img_goods','created_date']


class LettersSerializers(serializers.ModelSerializer):
    user_admin = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, many=True)

    class Meta:
        model = Letters
        fields = ['title_letter', 'content', 'img_letter', 'user_admin', 'people', 'created_date']


class BillSerializers(serializers.ModelSerializer):
    class Meta:
        model = Bill
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = ['id', 'name_bill', 'money', 'decription', 'type_bill', 'status_bill', 'user_resident', 'created_date',
                  'updated_date', ]


class ForgotPasswordSerializers(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = People
        fields = ['name_people', 'email','identification_card']


class PeopleSerializers(serializers.ModelSerializer):
    class Meta:
        model = People
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = ['name_people', 'birthday', 'sex', 'phone', 'expiry', 'expiry', 'ApartNum', 'identification_card',]



class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
