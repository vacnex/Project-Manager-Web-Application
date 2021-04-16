from ProjectManager.forms import LoginForm, RegistionForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
# from django.views.generic.edit import CreateView
from django.contrib.auth import login, authenticate, decorators
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages

# from django.contrib import messages


def index(request):
    return render(request, 'Pages/index.html')

@decorators.login_required(login_url='/login')
def home(request):
    return render(request, 'Pages/home.html')

def home_guest(request):
    return render(request, 'Pages/home_guest.html')

def loginUser(request):
    form = LoginForm()
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        login_user = authenticate(username=username, password=password)
        if login_user is None:
            # context = {'login_error': "Đăng nhập thất bại."}
            return render(request, 'Pages/login.html', {'form': form, 'login_error': "Đăng nhập thất bại."})
        login(request, login_user)
        next_url = request.POST.get('next')
        if next_url:
            return HttpResponseRedirect(next_url)
        else:
            return redirect('home')
        # return redirect('home')
    return render(request, 'Pages/login.html', {'form': form})
    
def register(request):
    if request.method == "POST":
        form = RegistionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = RegistionForm()
    # print(form)
    return render(request, 'Pages/register.html', {'form': form})
