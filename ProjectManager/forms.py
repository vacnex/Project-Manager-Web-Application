from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, Project
from django.core.exceptions import ValidationError
import re

class RegistionForm(UserCreationForm):
    username = forms.CharField(max_length=12, widget=forms.TextInput(
        attrs={'class': 'form-control', 'placeholder': 'Tài khoản'}))
    email = forms.EmailField(widget=forms.EmailInput(
        attrs={'class': 'form-control', 'placeholder': 'Nhập lại email'}))
    password1 = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'placeholder': 'Mật khẩu'}))
    password2 = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'placeholder': 'Nhập lại mật khẩu'}))

    class Meta(UserCreationForm.Meta):
        model = User

    def clean_username(self):
        username = self.cleaned_data['username']
        if not re.search(r'^\w+$', username):
            raise ValidationError("Tên tài khoản có kí tự đặc biệt")
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        raise ValidationError("Tài khoản đã tồn tại")


class LoginForm(AuthenticationForm):
    username = forms.CharField(max_length=12, widget=forms.TextInput(
        attrs={'class': 'form-control', 'placeholder': 'Tài khoản'}))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'placeholder': 'Mật khẩu'}))
    error_messages = {
        'invalid_login': ("Hãy nhập đúng %(username)s và mật khẩu."),
        'inactive': ("Tài khoản này không hoạt động."),
    }

class ProjectRegistersForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['Project_Name', 'Type', 'schoolYear', 'description']
        widgets = {
            'Project_Name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Tên Đề Tài'}),
            'Type': forms.Select(attrs={'class': 'form-select', 'placeholder': 'Loại Đề Tài'}),
            'schoolYear': forms.Select(attrs={'class': 'form-select', 'placeholder': 'Khoá'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Mô Tả'}),
        }


class ConfirmProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['Project_Name', 'Type', 'schoolYear', 'description', 'Users','Is_Confirm']
        widgets = {
            'Project_Name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Tên Đề Tài'}),
            'Type': forms.Select(attrs={'class': 'form-select', 'placeholder': 'Loại Đề Tài'}),
            'schoolYear': forms.Select(attrs={'class': 'form-select', 'placeholder': 'Khoá'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Mô Tả'}),
            'Is_Confirm': forms.CheckboxInput(attrs={'class': 'form-check-input', 'placeholder': 'Xác nhận đề tài'}),
        }
