
from django.urls import path, include, re_path
from QlChungCu import views
from rest_framework.routers import DefaultRouter



router = DefaultRouter()
# router.register('people', views.PeopleViewset) #Có 2 tham số: + refix chỉ định tiết đầu ngữ phần đầu của enpoint URL tạo ra cho mình
router.register('User', views.ResidentLoginViewset)
router.register('CarCard', views.CarCardViewset)
router.register('Bill', views.BillViewSet)
router.register('Box', views.BoxViewSet)
router.register('Info', views.InfoViewSet)
router.register('momo', views.MomoViewSet, basename='momo')
router.register('zalo', views.ZaloViewSet, basename='zalo')
router.register('user_info_people', views.InfoPeopleViewSet, basename='user_info')
router.register('goods', views.GoodsViewSet)
router.register('letter', views.LettersViewSet)
router.register(r'surveys', views.SurveyViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'surveyresponses', views.SurveyResponseViewSet)
router.register(r'answers', views.AnswerViewSet)

# Tạo 2 enpoint tương ứng với 5 API
# +/people/ - GET
# +/people/ - POST
# +/people/{people_id}/ - GET
# +/people/{people_id}/ - PUT
# +/people/{people_id}/ - DELETE
urlpatterns = [
    path('', include(router.urls)),

]
