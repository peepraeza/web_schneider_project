#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect
from ..models import Meter
# from ..post_data import parse_keys
from .views import calculate_cost_energy, save_bill_cost
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
from datetime import datetime, timedelta
import time
import requests
import pytz
import numpy as np
import os, glob

def edit_channel(request):
    ch = int(request.POST.get("m_ch"))
    des = request.POST.get("channel_description")
    # _m = Meter.objects.filter(channel=1).update(description="Main House")
    _m = Meter.objects.filter(channel=ch).update(description=des)
    
    return redirect("/setting/")
    
def edit_ip(request):
    ip = request.POST.get("rp_ip")
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, '../../static/json/ip.txt')
    data_file = open(file_path , 'w')       
    ip = data_file.write(ip)
    return redirect("/setting/")
    
def edit_bill(request):
    bill = request.POST.get("cbill")
    unit = request.POST.get("unit")
    live = request.POST.get("liveat")
    print(live)
    sum_wh, cost = 0, 0
    date = []
    json_array = []
    module_dir = os.path.dirname(__file__)
    energy_path = os.path.join(module_dir, '../../static/json/data_energy/')
    list_of_files = sorted(glob.glob(energy_path+'*'))
    for files in list_of_files:
        _, s = os.path.split(files)
        date_time = os.path.splitext(s)[0]
        _d = os.path.splitext(s)[0].split('-')[2]
        with open(energy_path+s) as f:
            data = json.load(f)
        if _d == bill.zfill(2):
            cost = calculate_cost_energy(sum_wh/1000)
            json_array.append(to_json(cost, date))
            sum_wh = 0
            date = []
            sum_wh += data['sum_p1']
            date.append(date_time)
        else:
            sum_wh += data['sum_p1']
            date.append(date_time)
    save_bill_cost(json_array)
    file_path = os.path.join(module_dir, '../../static/json/setting.json')
    data = {"bill-cycle": bill, "unit": unit, "live":live}
    with open(file_path, 'w') as f:
        json.dump(data, f, ensure_ascii=False)     
    return redirect("/setting/")

def to_json(cost, date):
    keep_json = {min(date)+"_"+max(date):cost}
    return keep_json


