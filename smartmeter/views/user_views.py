#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.forms import UserCreationForm, PasswordResetForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
from datetime import datetime, timedelta
import time
import requests
import pytz
import numpy as np


class EmailValidationOnForgotPassword(PasswordResetForm):
    def clean_email(self):
        email = self.cleaned_data['email']
        if not User.objects.filter(email__iexact=email, is_active=True).exists():
            msg = "There is no user registered with the specified E-Mail address."
            self.add_error('email', msg)
        return email
    
def logout(request):
    if request.method == "POST":
        # del request.session["user"]
        return redirect("/signin/")
    else:
        return redirect("/")

@login_required
def change_email(request):
    if request.method == "POST":
        user = User.objects.get(pk=1) # get first user 
        print(user.username)
        pwd = request.POST.get("password")  # get password 
        new_email = request.POST.get("new_email")   # get new email
        user_validated = user.check_password(pwd)   # validate user and password
        print(user_validated)
        if user_validated:  
            user.email = new_email
            print(user.email)
            user.save()
            return redirect("/accounts/change_email/done")
        else:
            msg = "* Password not correct. Please try again."
            return render(request, "registration/email_change_form.html",{'message':msg})  

    return render(request, "registration/email_change_form.html")

def change_email_done(request):
    return render(request, "registration/email_change_done.html")

    
