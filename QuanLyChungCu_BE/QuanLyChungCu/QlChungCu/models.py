# Chuyển đổi cấu 1 trúc dữ liệu hoặc đối tượng thành 1 định dạng có thể lưu trữ được, có thể chuyển đổi lại thành như ban đầu thông qua quá trình deserialization

from django.db import models
# thừa hưởng thuộc tính của nó nhưng muốn dùng của mình để chứng thực
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        # ordering = ['-id']


class User(AbstractUser):
    class EnumRole(models.TextChoices):
        RESIDENT = 'Resident'
        ADMIN = 'Admin'

    user_role = models.CharField(max_length=20, choices=EnumRole.choices, default=EnumRole.RESIDENT)
    avatar_acount = CloudinaryField(null=True)
    change_password_required = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Băm mật khẩu nếu mật khẩu đã được thiết lập
        if self.password:
            self.set_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class Box(BaseModel):
    class EnumStatusBox(models.TextChoices):
        WAITING = 'waiting to receive'
        RECEIVED = 'received'

    stand = models.CharField(max_length=255)
    describe = models.CharField(max_length=255)
    box_status = models.CharField(max_length=50, choices=EnumStatusBox.choices,
                                  default=EnumStatusBox.WAITING)  # trạng thái của Box

    user_admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.stand


class Goods(BaseModel):
    class EnumStatusGood(models.TextChoices):
        WTR = 'Chờ nhận hàng'
        RECEIVED = 'Đã lấy hàng'
        URG = 'Người dùng đã nhận được hàng'

    name_goods = models.CharField(max_length=255)
    img_goods = CloudinaryField(null=True)
    received_Goods = models.CharField(max_length=50, choices=EnumStatusGood.choices,
                                      default=EnumStatusGood.WTR)  # trạng thái hàng hóa
    note = models.CharField(max_length=255, default='no notes')
    box = models.ForeignKey(Box, on_delete=models.SET_NULL, null=True)
    size = models.CharField(max_length=255, null=True)


class People(BaseModel):
    name_people = models.CharField(max_length=50)
    birthday = models.DateTimeField(null=True, blank=True)
    sex = models.CharField(max_length=20)
    phone = models.CharField(max_length=20, null=True)
    expiry = models.IntegerField(null=False)  # Hạn sử dụng nhà
    ApartNum = models.CharField(max_length=20, null=True)  # Số nhà
    identification_card = models.CharField(max_length=20, null=True)  # Số căng cước công dân

    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    box = models.ForeignKey(Box, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name_people


class CarCard(BaseModel):
    class EnumStatusCard(models.TextChoices):
        UN = 'Unconfimred'
        WAIT = 'Wait_for_confirmation'
        CONFIRMER = 'Confirmed'

    area = models.CharField(max_length=255)
    status_card = models.CharField(max_length=50, choices=EnumStatusCard.choices,
                                   default=EnumStatusCard.WAIT)  # Trạng thái thẻ xe
    vehicle_type = models.CharField(max_length=255, default='motorbike')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


class Letters(BaseModel):
    title_letter = models.TextField(null=True)
    content = RichTextField(null=True)
    img_letter = CloudinaryField(null=True)
    feedback_results = models.CharField(max_length=255, null=True)

    people = models.ForeignKey(People, on_delete=models.CASCADE)
    user_admin = models.ManyToManyField(User)


class Bill(BaseModel):
    class EnumStatusBill(models.TextChoices):
        UNPAID = 'Unpaid'
        PAID = 'paid'

    class EnumTypeBill(models.TextChoices):
        ELECTRICITY = 'Electricity'
        WATER = 'Water '
        OTHER = 'Other'

    name_bill = models.CharField(max_length=255)
    money = models.FloatField()
    decription = models.CharField(max_length=255)  # ghi chu
    type_bill = models.CharField(max_length=50, choices=EnumTypeBill.choices,
                                 default=EnumTypeBill.OTHER)
    status_bill = models.CharField(max_length=50, choices=EnumStatusBill.choices,
                                   default=EnumStatusBill.UNPAID)
    trading_code = models.CharField(max_length=255, null=True)  # Mã giao dịch
    transaction_images = CloudinaryField(null=True, blank=True)
    payment_style = models.CharField(max_length=255, null=True, default='Null')
    user_resident = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name_bill


# Phiếu khảo sát
class Survey(models.Model):
    title = models.CharField(max_length=200, default='KHAO SAT...')
    note = models.CharField(max_length=200, default='None')
    user_surveyor = models.ForeignKey(User, on_delete=models.CASCADE,
                                      limit_choices_to={'user_role': User.EnumRole.ADMIN})
    start_date = models.DateTimeField(default=timezone.now)  # Ngày bắt đầu là ngày tạo
    end_date = models.DateTimeField(null=True)  # Ngày kết thúc

    def __str__(self):
        return self.title


# Câu hỏi khảo sát
class Question(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=300, null=True)

    def __str__(self):
        return self.text


# Kết quả khỏa sát(Người dùng gửi về)
class SurveyResponse(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)  # Trạng thái hoàn thành khảo sát
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    respondent = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return f"Response for {self.survey} by {self.respondent}"  # phản hồi cho {tiêu đề cuộc khảo sát} bới{người dùng}


# Kết quả chi tiết cho từng câu hỏi
class Answer(models.Model):
    response = models.ForeignKey(SurveyResponse, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"Answer to {self.question} in {self.response}" # Trả lời cho {câu hỏi} tại {Kết quả khảo sát}
