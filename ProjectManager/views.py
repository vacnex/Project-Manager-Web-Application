from ProjectManager.forms import LoginForm, RegistionForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.edit import CreateView
from django.contrib.auth import authenticate
from django.contrib import messages


def index(request):
    return render(request, 'Pages/index.html')

def home(request):
    return render(request, 'Pages/home.html')

def home_guest(request):
    return render(request, 'Pages/home_guest.html')

def login(request):
    form = LoginForm()
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            # form.save()
            un = request.POST.get('username')
            pw = request.POST.get('password')
            return HttpResponse('vua nhap {0},{1}'.format(un, pw))
            # return HttpResponseRedirect('/')
    return render(request, 'Pages/login.html', {'form': form})


def register(request):
    if request.method == "POST":
        form = RegistionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = RegistionForm()
    print(form)
    return render(request, 'Pages/register.html', {'form': form})
