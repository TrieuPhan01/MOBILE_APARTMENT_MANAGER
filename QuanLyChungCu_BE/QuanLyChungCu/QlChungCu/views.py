import random
import string

import cloudinary
import yagmail
from django.db.models import Q
from rest_framework import viewsets, generics, status, parsers, permissions
from QlChungCu import serializers, paginators
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, People, CarCard, Box, Goods, Letters, Bill, Survey, Question, Answer, SurveyResponse
from .serializers import PeopleSerializers, UserSerializers, CarCardSerializers, BoxSerializers, GoodsSerializers, \
    LettersSerializers, BillSerializers, UpdateResidentSerializer, \
    ForgotPasswordSerializers, SurveySerializer, QuestionSerializer, AnswerSerializer, \
    SurveyResponseSerializer, AdminSerializers
from datetime import datetime, timedelta, timezone, time
from django.views.decorators.csrf import csrf_exempt
import json
import urllib.request
import urllib
import uuid
import requests
import hmac
import hashlib
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response as DRFResponse


# # ModelViewSet Kế thừa APIview, APIview kế thừa tiêu chuẩn của django
# # ModelViewSet implament 1 số thứ sẵn từ model
# # ModelViewSet chỉ cần chỉ định 2 th:  + Queryset: Câu truy vấn dựa vào đổ lên model cho mình
# #                                      + serializer: pare danh sách lấy được ở queryset ra bên ngoài, và create update, retrofit
# # ListAPIView : GET /Urlname/
# # RetrieveAPIView: GET /Urlname/{id}/
# # CreateAPIView: POST /Urlname/
# # DestroyAPIView: DELETE /Urlname/
# # UpdateAPIView: PUT + PATCH  /Urlname/{id}/
# # ListCreateAPIView: GET + POST /Urlname/
# # RetrieveUpdateAPIView: GET + PUT + PATCH /Urlname/{id}/
# # RetrieveDestroyAPIView: GET + DELETE /Urlname/{id}/
# # RetrieveUpdateDestroyAPIView: GET + PUT + PATCH + DELETE /Urlname/{id}/


# API THÔNG TIN USER RESIDENT
class ResidentLoginViewset(viewsets.ViewSet, generics.ListAPIView):  # API Người dùng đăng nhập
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializers
    parser_classes = [parsers.MultiPartParser, JSONParser, FormParser]

    def get_permissions(self):
        if self.action in ['upload_avatar', 'get_admin']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    # Khi nguời dùng đăng nhập lần đầu tiên thì bắt buộc đổi mk + avt

    @action(methods=['post'], url_path='upload_avatar', detail=False)
    def update_account(self, request):
        user = request.user  # Người dùng đang đăng nhập

        try:
            if user.change_password_required:
                # Nếu change_password_required là True, chỉ xuất ra dữ liệu của tài khoản
                serializer = UpdateResidentSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                user.password = request.data.get('password')
                avatar_file = request.data.get('avatar')

                new_avatar = cloudinary.uploader.upload(avatar_file)
                user.avatar_acount = new_avatar['secure_url']
                user.change_password_required = True
                user.save()
                return Response({'message': 'Avatar uploaded successfully'}, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({"message": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

    # Thong tin tai khoang User
    @action(methods=['get'], url_path='get_user', detail=False)  # Người dùng xem thông tin user đăng nhập của mình
    def get_user(self, request):
        # Lấy người dùng đang đăng nhập từ request
        current_user = request.user
        user = User.objects.filter(id=current_user.id).first()
        serialized = self.serializer_class(user).data
        return Response(serialized, status=status.HTTP_200_OK)

    # def get_queryset(self):
    #     queryset = self.queryset
    #
    #     q = self.request.query_params.get('q')
    #     if q:
    #         queryset = queryset.filter(name_acount__icontains=q)
    #
    #     ad_id = self.request.query_params.get('admin_id')
    #
    #     if ad_id:
    #         queryset = queryset.filter(admin_id=ad_id)
    #     return queryset
    @action(methods=['get'], url_path='get_admin', detail=False)  # Người dùng xem id và ten admin
    def get_admin(self, request):
        # Lấy người dùng đang đăng nhập từ request
        user = User.objects.filter(user_role=User.EnumRole.ADMIN).all()
        serialized = AdminSerializers(user, many=True).data
        return Response(serialized, status=status.HTTP_200_OK)


# API THẺ GIỮ XE
class CarCardViewset(viewsets.ViewSet, generics.ListAPIView):
    queryset = CarCard.objects.filter(is_active=True)
    serializer_class = CarCardSerializers

    def get_permissions(self):
        if self.action in ['create_carcard', 'delete_card']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='get_card', detail=True)  # Người dùng xem thông tin thẻ xe của mình
    def get_carcard(self, request, pk):
        # Lấy người dùng đang đăng nhập từ request
        current_user = request.user
        # Lấy thông tin các thẻ xe mà người dùng đã đăng ký
        carcard_user = CarCard.objects.filter(user=current_user)
        serialized_data = self.serializer_class(carcard_user, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='update_card', detail=False)
    def create_carcard(self, request):
        current_user = request.user

        # Kiểm tra số lượng thẻ xe của người dùng
        num_carcards = CarCard.objects.filter(user=current_user).count()
        if num_carcards >= 3:
            return Response({"error": "Bạn đã đạt tối đa số lượng thẻ xe."},
                            status=status.HTTP_403_FORBIDDEN)  # từ chối

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save(user=current_user,
                            status_card=CarCard.EnumStatusCard.CONFIRMER, is_active=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # API Xóa thẻ xe

    @action(methods=['delete'], url_path='delete_card', detail=False)
    def delete(self, request):
        current_user = request.user
        carcard_data = request.data
        carcard_id = carcard_data.get('id')
        try:
            carcard = CarCard.objects.get(user=current_user, id=carcard_id)
        except CarCard.DoesNotExist:
            return Response({"error": "Không tìm thấy thẻ xe hoặc thẻ xe không thuộc về người dùng hiện tại!"},
                            status=status.HTTP_404_NOT_FOUND)

        carcard.delete()
        return Response({"message": "Thẻ xe đã được xóa thành công."}, status=status.HTTP_200_OK)


# # API HÓA ĐƠN
class BillViewSet(viewsets.ViewSet, generics.ListAPIView):

    def get_permissions(self):
        if self.action in ['get_bill', 'upload_imgbank', ]:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    queryset = Bill.objects.filter(is_active=True)
    serializer_class = BillSerializers

    # Xem hóa đơn của người dùng hiện có
    @action(methods=['get'], url_path='get_bill', detail=False)
    def get_bill(self, request):
        # Lấy người dùng đang đăng nhập từ request
        current_user = request.user
        # Lấy thông tin các Hóa đơn mà người dùng đang có
        bill_user = Bill.objects.filter(user_resident=current_user.id)
        serialized_data = self.serializer_class(bill_user, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)

    # Người dùng tìm kiếm hóa đơn theo tên và id
    @action(methods=['get'], url_path='search_bill', detail=True)
    def search_bill(self, request, pk):
        current_user = request.user
        bill_id = request.query_params.get('id', None)
        bill_name = request.query_params.get('name', None)

        bills = Bill.objects.filter(user_resident=current_user.id)

        if bill_id:
            bills = bills.filter(id=bill_id)
        if bill_name:
            # Sử dụng Q object để tìm kiếm theo tên bill
            bills = bills.filter(Q(name_bill__icontains=bill_name))  # icontains : Tìm kiếm không phân biệt hoa thường

        serialized_data = self.serializer_class(bills, many=True).data

        if not serialized_data:  # Kiểm tra có hóa đơn nào phù hợp hay không
            return Response({"message": "No bills found with the given criteria"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialized_data, status=status.HTTP_200_OK)

    # API UPLOAD ảnh thanh toán qua ngân hàng
    @action(methods=['post'], url_path='upload_imgbanking', detail=False)
    def upload_imgbank(self, request):
        current_user = request.user
        try:

            id_bill = request.data.get('id')
            total = request.data.get('total')
            img_file = request.data.get('image')
            bill = Bill.objects.filter(id=id_bill, money=total, user_resident=current_user.id).first()
            print(id_bill, total, img_file, bill)

            if bill.status_bill == Bill.EnumStatusBill.UNPAID:
                imageCloud = cloudinary.uploader.upload(img_file)
                bill.transaction_images = imageCloud['secure_url']
                bill.payment_style = 'BANKING'
                bill.save()

                return Response({'message': 'Image Bank uploaded successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Cannot find invoice to update"},
                                status=status.HTTP_404_NOT_FOUND)
        except current_user.DoesNotExist:
            return Response({"message": "Account not found"}, status=status.HTTP_404_NOT_FOUND)


# API TỦ ĐỒ
class BoxViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Box.objects.filter(is_active=True)
    serializer_class = BoxSerializers

    @action(methods=['get'], url_path='get_box', detail=False)
    def get_box(self, request):
        # Lấy người dùng đang đăng nhập từ request
        current_user = request.user
        # Lấy thông tin các Hóa đơn mà người dùng đang có
        box_user = Box.objects.filter(user_admin=current_user.id)
        serialized_data = self.serializer_class(box_user, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)


class GoodsViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Goods.objects.filter(is_active=True)
    serializer_class = GoodsSerializers

    def get_permissions(self):
        if self.action in ['get_goods', 'create_goods']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='get_goods', detail=False)
    def get_goods(self, request):
        try:
            user = request.user  # Người dùng hiện tại đăng nhập
            boxes = Box.objects.filter(user_admin=user)  # Lấy Tất cả các box mà người dùng là admin
            print("ádad")
            goods = Goods.objects.filter(box__in=boxes).order_by(
                '-created_date')  # lọc các đối tượng mà trường đó có giá trị trong một danh sách đã cho
            print("vvvv")
            # Lưu ý: Sử dụng .url để truy cập đường dẫn đầy đủ của hình ảnh từ Cloudinary
            serialized_data = self.serializer_class(goods, many=True, context={'request': request}).data
            return Response(serialized_data, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Không thể lấy thông tin hàng hóa"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='create_goods', detail=False)
    def create_goods(self, request):
        serializer_data = request.data.copy()  # Tạo một bản sao của dữ liệu request để thêm trường box
        user = request.user  # Người dùng hiện tại đăng nhập
        boxes = Box.objects.filter(user_admin=user)  # Tất cả các box của người dùng
        if boxes.exists():  # Kiểm tra xem người dùng có box nào không
            serializer_data['box'] = boxes.first().id  # Lưu id của box đầu tiên vào trường box
            serializer_data['is_active'] = True
        else:
            return Response({"message": "Người dùng không có box"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = GoodsSerializers(data=serializer_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['patch'], url_path='Update_items_tatus', detail=True)
    def Update_items_tatus(self, request, pk):
        try:
            user = request.user
            print(user)
            id_good = request.data.get('id')  # Lấy ID hàng hóa
            print(id_good)
            boxes = Box.objects.filter(user_admin=user)

            # Tìm hàng hóa trong các hộp của user có ID là id_good
            goods = Goods.objects.filter(box__in=boxes, received_Goods=Goods.EnumStatusGood.RECEIVED, id=pk)

            if goods.exists():
                goods.update(received_Goods=Goods.EnumStatusGood.URG)
                return Response({"message": "Cập nhật trạng thái thành công"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Không tìm thấy hàng hóa để cập nhật"},
                                status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"message": "Không thể cập nhật trạng thái hàng hóa"},
                            status=status.HTTP_400_BAD_REQUEST)


# API INFO NGUOI DUNG
class InfoViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = People.objects.filter(is_active=True)
    serializer_class = ForgotPasswordSerializers

    # API tạo code xử lý quên mật khẩu
    @action(methods=['post'], url_path='create_passForgot', detail=False)
    def create_passForgot(self, request):
        name_people = request.data.get('name_people')
        identification_card = request.data.get('identification_card')

        try:
            person = People.objects.get(identification_card=identification_card, name_people=name_people)
        except People.DoesNotExist:
            return Response({"message": "Không tìm thấy người dùng"},
                            status=status.HTTP_404_NOT_FOUND)

        # Tạo mã code ngẫu nhiên
        code = ''.join(random.choices(string.digits, k=6))

        # Xử lý gửi mail
        yag = yagmail.SMTP("phanloan2711@gmail.com", 'mpgnbisxmfgwpdbg')
        to = person.user.email
        subject = 'CHUNG CƯ HIỀN VY: Mã xác thực đổi mật khẩu'
        body = f'Mã xác thực của bạn là: {code}'
        yag.send(to=to, subject=subject, contents=body)

        # Lưu mã code vào session của người dùng
        request.session['verification_code'] = code
        request.session['user_id'] = person.user.id
        request.session.modified = True  # Đảm bảo session được cập nhật

        return Response({"message": "Mã xác thực đã được gửi qua email", "code": code}, status=status.HTTP_200_OK)

    # API gui mat khau moi
    @action(methods=['post'], url_path='reset_password', detail=False)
    def reset_password(self, request):
        code = request.data.get('code')
        new_password = request.data.get('password')
        print(new_password)

        # Lấy mã code đã lưu trong session của người dùng
        session_code = request.session.get('verification_code')
        user_id = request.session.get('user_id')

        if not session_code or not user_id:
            return Response({"message": "Session không hợp lệ hoặc đã hết hạn"}, status=status.HTTP_400_BAD_REQUEST)

        if code != session_code:
            return Response({"message": "Mã xác thực không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

        # Đặt mật khẩu mới cho người dùng
        user.password = new_password
        # user.set_password(new_password)
        user.change_password_required = True
        user.save()

        # Xóa mã code khỏi session sau khi đã sử dụng
        del request.session['verification_code']
        del request.session['user_id']

        return Response({"message": "Mật khẩu đã được đặt lại thành công"}, status=status.HTTP_200_OK)


class InfoPeopleViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = People.objects.filter(is_active=True)
    serializer_class = PeopleSerializers

    @action(methods=['get'], url_path='get_infopeople', detail=False)
    def get_infopeople(self, request):
        # Lấy người dùng đăng nhập hiện tại
        user = request.user
        try:
            # Tìm thông tin People tương ứng với người dùng
            people_data = People.objects.get(user=user)
        except People.DoesNotExist:
            return Response({"message": "Không tìm thấy thông tin người dùng"}, status=status.HTTP_404_NOT_FOUND)

        serialized_data = self.serializer_class(people_data).data
        return Response(serialized_data, status=status.HTTP_200_OK)


# API MOMO
class MomoViewSet(viewsets.ViewSet):
    serializer_class = BillSerializers

    # Hứng Data từ momo gửi về
    @action(detail=False, methods=['post'], url_path='momoipn')
    @csrf_exempt
    def momo_ipn(self, request):
        try:
            payment_data = request.data
            print(payment_data)
            result_code = payment_data.get("resultCode")
            orderInfo = payment_data.get('orderInfo')  # Trường orderInfo chứa id của cái Bill.
            print(orderInfo)
            orderId = payment_data.get('orderId')
            amount = payment_data.get('amount')
            print(amount)

            if result_code != 0:
                return JsonResponse({'error': "Thanh toán thất bại", 'status': 400})

            # Tìm tất cả các Bill thỏa mãn điều kiện id=orderInfo, money=amount
            bills = Bill.objects.filter(id=orderInfo, money=amount)

            # Kiểm tra nếu không có Bill thỏa mãn điều kiện, trả về lỗi
            if not bills.exists():
                return Response({"error": "Không tìm thấy hóa đơn tương ứng", 'status': status.HTTP_404_NOT_FOUND})

            # Thay đổi trạng thái của tất cả các Bill thỏa mãn điều kiện thành "paid"
            print('Tới update')
            bills.update(status_bill=Bill.EnumStatusBill.PAID, trading_code=orderId, payment_style='Momo')

            return Response({"message": "Thành công"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'status': status.HTTP_500_INTERNAL_SERVER_ERROR, 'error': str(e)})

    @action(detail=False, methods=['post'], url_path='create', url_name='momo_create')
    @csrf_exempt
    def create_momo_payment(self, request):

        endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
        ipnUrl = "https://91fe-171-243-49-67.ngrok-free.app/momo/momoipn/"

        accessKey = "F8BBA842ECF85"
        secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
        partnerCode = "MOMO"
        orderInfo = self.request.data.get('id')
        requestId = str(uuid.uuid4())
        amount = self.request.data.get('total')
        orderId = str(uuid.uuid4())
        # orderId = total.get('appointment_id')+total.get('user_id')+total.get('booking_date')

        requestType = "captureWallet"
        extraData = ""
        redirectUrl = ""

        rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl \
                       + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode \
                       + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType

        h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
        signature = h.hexdigest()
        data = {
            'partnerCode': partnerCode,
            'partnerName': "Test",
            'storeId': "MomoTestStore",
            'requestId': requestId,
            'amount': amount,
            'orderId': orderId,
            'orderInfo': orderInfo,
            'redirectUrl': redirectUrl,
            'ipnUrl': ipnUrl,
            'lang': "vi",
            'extraData': extraData,
            'requestType': requestType,
            'signature': signature,
            'orderExpireTime': 10,
        }

        data = json.dumps(data)

        clen = len(data)
        response = requests.post(endpoint,
                                 data=data,
                                 headers={'Content-Type': 'application/json', 'Content-Length': str(clen)})

        if response.status_code == 200:
            response_data = response.json()
            return JsonResponse({**response_data})
        else:
            return JsonResponse({'error': 'Invalid request method'})


# API ZALO
class ZaloViewSet(viewsets.ViewSet):
    serializer_class = BillSerializers

    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='create', url_name='create_zalo')
    def create_zalo_payment(self, request):  # tạo đường link thanh toán
        endpoint = "https://sb-openapi.zalopay.vn/v2/create"
        app_id = 2553
        key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL"
        key2 = "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz"

        appuser = self.request.data.get('id')
        transID = random.randrange(1000000)
        apptime = int(round(datetime.now().timestamp() * 1000))  # milliseconds
        app_trans_id = "{:%y%m%d}_{}".format(datetime.today(), transID)
        print("t", app_trans_id)
        embed_data = json.dumps({})
        item = json.dumps([{}])
        amount = self.request.data.get('amount')
        callback_url = 'http://ffc9-171-243-49-117.ngrok-free.app/zalo/query_zalopay/'

        # Tạo chuỗi dữ liệu theo định dạng yêu cầu
        raw_data = "{}|{}|{}|{}|{}|{}|{}".format(app_id, app_trans_id, appuser, amount, apptime, embed_data, item)

        # Tính toán MAC bằng cách sử dụng HMAC
        mac = hmac.new(key1.encode(), raw_data.encode(), hashlib.sha256).hexdigest()
        print("mac trong API Gửi" + mac)

        # Dữ liệu gửi đi
        data = {
            "app_id": app_id,
            "app_user": appuser,
            "app_time": apptime,
            "amount": amount,
            "app_trans_id": app_trans_id,
            "embed_data": embed_data,
            "item": item,
            "description": "Lazada - Payment for the order #" + str(transID),
            "bank_code": "zalopayapp",
            "mac": mac,
            "callback_url": callback_url
        }

        # Gửi yêu cầu tạo
        response = requests.post(url=endpoint, data=data)

        if response.status_code == 200:
            response_data = response.json()
            print(response_data)
            return JsonResponse(
                {'ok': '200', 'app_trans_id': app_trans_id, 'order_url': response_data.get('order_url')})
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=400)

    # API hứng dữ liệu ZaLopay gửi về
    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='query_zalopay', url_name='query_zalo')
    def query_zalo_payment(self, request):  # kiểm tra trạng thái thanh toán?
        result = {}
        key2 = 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz'
        try:
            cbdata = request.data
            mac = hmac.new(key2.encode(), cbdata['data'].encode(), hashlib.sha256).hexdigest()
            print("cbdata['mac'] " + cbdata['mac'])
            print(mac)
            # kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if mac != cbdata['mac']:
                # callback không hợp lệ
                result['return_code'] = -1
                result['return_message'] = 'mac not equal'
            else:
                # Thanh toán thành công
                # Merchant cập nhật trạng thái cho đơn hàng
                dataJson = json.loads(cbdata['data'])
                print(f'datajson: {dataJson}')

                result['return_code'] = 1
                result['return_message'] = 'success'

                app_user = dataJson.get('app_user')  # Trường orderInfo chứa id của cái Bill.
                print(app_user)
                amount = dataJson.get('amount')
                print(amount)
                zp_trans_id = dataJson.get('zp_trans_id')
                print("thành công")
                # Tìm Bill thỏa mãn điều kiện id=orderInfo, money=amount
                bills = Bill.objects.filter(id=app_user, money=amount)
                print(bills)  # Chuyển đổi bills thành chuỗi trước khi nối

                # Kiểm tra nếu không có Bill thỏa mãn điều kiện, trả về lỗi
                if not bills.exists():
                    return Response({"error": "Không tìm thấy hóa đơn tương ứng", 'status': status.HTTP_404_NOT_FOUND})

                # Thay đổi trạng thái của tất cả các Bill thỏa mãn điều kiện thành "paid"
                print('Tới update')
                bills.update(status_bill=Bill.EnumStatusBill.PAID, trading_code=zp_trans_id, payment_style='ZaloPay')
                print(bills)  # Chuyển đổi bills thành chuỗi trước khi nối

        except Exception as e:
            result['return_code'] = 0  # ZaloPay server sẽ callback lại (tối đa 3 lần)
            result['return_message'] = str(e)

        # Thông báo kết quả cho ZaloPay server
        print(result)
        return JsonResponse(result)


# API upload anh thanh toan qua ngan hang


class LettersViewSet(viewsets.ViewSet):
    queryset = Letters.objects.filter(is_active=True)
    serializer_class = LettersSerializers

    def get_permissions(self):
        if self.action in ['create_letters', ' get_letters']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'], url_path='get_letters', url_name='get_letters')
    def get_letters(self, request):
        user = self.request.user
        letters = Letters.objects.filter(people=user.people)
        serializer = LettersSerializers(letters, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create_letters', url_name='create_letters')
    def create_letters(self, request, *args, **kwargs):
        # Lấy thông tin từ request data
        title_letter = request.data.get('title_letter')
        content = request.data.get('content')
        img_letter = request.data.get('img_letter')
        user_admin_ids = request.data.get('user_admin', [])

        # Xác thực người dùng và lấy thông tin People
        if request.user.is_authenticated:
            try:
                people = request.user.people  # Lấy thông tin People của user đăng nhập
            except People.DoesNotExist:
                return Response({"error": "People profile does not exist for this user."},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Tạo một đối tượng Letters để lưu vào cơ sở dữ liệu
        letters_data = {
            'title_letter': title_letter,
            'content': content,
            'img_letter': img_letter,
            'people': people.id  # Gán people_id vào đối tượng Letters
        }

        # Tạo và lưu đối tượng Letters
        serializer = LettersSerializers(data=letters_data)
        if serializer.is_valid():
            letters = serializer.save()

            # Thêm các admin được chọn vào danh sách user_admin của Letters
            if user_admin_ids:
                letters.user_admin.add(*user_admin_ids)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SurveyViewSet(viewsets.ViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        try:
            survey = self.queryset.get(pk=pk)
            questions = survey.questions.all()
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data)
        except Survey.DoesNotExist:
            return Response({'error': 'Survey not found'}, status=status.HTTP_404_NOT_FOUND)


class QuestionViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


from django.db.models import Case, When, BooleanField, F, Value


class SurveyResponseViewSet(viewsets.ModelViewSet):
    queryset = SurveyResponse.objects.all()
    serializer_class = SurveyResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        print(data)
        try:
            survey = Survey.objects.get(id=data['survey'])
            respondent = request.user
            response = SurveyResponse.objects.create(survey=survey, respondent=respondent, completed=True)
            print(response)
            answers = data.get('answers', [])
            for answer in answers:
                question = Question.objects.get(id=answer['question'])
                Answer.objects.create(response=response, question=question, score=answer['score'])
            serializer = SurveyResponseSerializer(response)  # Sử dụng serializer trực tiếp
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Survey.DoesNotExist:
            return Response({'error': 'Survey does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Question.DoesNotExist:
            return Response({'error': 'Question does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AnswerViewSet(viewsets.ViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        try:
            response = SurveyResponse.objects.create(
                survey_id=data['survey'],
                respondent_id=data['respondent'],
                timestamp=data['timestamp']
            )
            for answer_data in data['answers']:
                Answer.objects.create(
                    response=response,
                    question_id=answer_data['question'],
                    score=answer_data['score']
                )
            return Response({'status': 'Response and answers created successfully'}, status=status.HTTP_201_CREATED)
        except SurveyResponse.DoesNotExist:
            return Response({'error': 'SurveyResponse does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Question.DoesNotExist:
            return Response({'error': 'Question does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
