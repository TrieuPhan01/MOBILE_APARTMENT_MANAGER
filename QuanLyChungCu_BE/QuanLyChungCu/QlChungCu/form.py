from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from QlChungCu.models import *


class LettersForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Letters
        fields = '__all__'


class SurveyForm(forms.ModelForm):
    class Meta:
        model = Survey
        fields = ['title', 'user_surveyor']  # Định nghĩa các trường muốn hiển thị trong form


class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['text']  # Định nghĩa các trường muốn hiển thị trong form
