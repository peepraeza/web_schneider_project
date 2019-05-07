#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.decorators.csrf import csrf_protect

from ..models import Meter
# from ..post_data import parse_keys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
from datetime import datetime, timedelta, date
import requests
import pytz
import numpy as np
import base64, zlib, time
import threading
from jsonmerge import Merger
import os, glob
import urllib3
from collections import defaultdict, deque
from statistics import mean 
import pandas as pd
import platform
import sklearn
from sklearn.externals import joblib
from skmultilearn.problem_transform import LabelPowerset

urllib3.disable_warnings()
pee_ja = 20
time_data, p1, p2, p3, p4, q1, q2, q3, q4, s1, s2, s3, s4, i1, i2, i3, i4, pf1 = ([] for i in range(18))
p1_wh, p2_wh, p3_wh, p4_wh = ({'day':{},'month':{}, 'year':{}} for i in range(4))
p2_pre_wh, p3_pre_wh, p4_pre_wh = ({'day':{}} for i in range(3))
cur_d1m, cur_d1hr, cur_d30m = (pd.DataFrame() for i in range(3))
cur_wh = [0, 0, 0, 0]
watt_data = deque([])
backup = False
key = {
    "type": "service_account",
    "project_id": "data-log-fb39d",
    "private_key_id": "80fcc158210ed58b29588b3a67d52c170c60d0d4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDnosoCGh4cByPb\nmXVsjoBR+jOhgh58Z8qrU6Z33MhIQ045fHsscz1ncI7HsgNC5jQ7dQ6ZY0IB9sMq\n0Z3JUo3KMS9lpsd/MAs8oq+zmU39QsGTm+Ha7kiTQuI4PjkOfUB9oyVcdyP6TXUk\nrAzrIAwJfnar5NKmFcpK6EsNzsumx2QVQaC/zK8VAQou8KBmEDc6VsHhUWFh6j9p\nSN0iCw8hWXjVRI/r1ReUs9kR+30QDSXnNIO77a8XFmZyC2maEnqPY6vSeRP1cTWa\nHHackO8TxnhR4siLwZ7o4LVe25ocLIbzC6PnzCDXgG7Vk/Yc2UsGdogcjgbGvjP9\n6yq5iWEvAgMBAAECggEARLStdIgorCmWAjn3cXanKymqjNpajo3+uGi8dMshAQYt\nurFom5um9/qT7zmm6/36OjSTWv3tA0YdR6MbSS7abcG/DEi23cvzWU3sDbqIPnnB\njzXqfRS2pC9viD00kU6nhVyR5WZVXpYBDBqYTlmYGGzRaFUcAjVuZl+We4b+Mv5b\nA/eWRx9AoJEy0Vr4HexEeJI+mJCOag+Ab1Kk4YkOpTLgDhnHHLfzn5n+H4Da8VaS\n5//4uFCDF5TIwHz4L3qZCWudDlVq6UF4390IpQTMMdyDgQJfeiesvQdcPKzae9EV\nYBo/QftB/kbZ66RukVAgIVEOf3vJtZplcfm+8MJokQKBgQD08/cnT2pze5hk7NnL\n09aSTYs/v7YKTQVgy5dCmQ5s/9KtS0KNnH2wbM/gIvmDSdsSoLVsSylybgShxF/f\n8yqprmtdPxw8jIkHUnyZIKBQAKYTXTfZF5QUgJ3E8qGxJ3xBUWGr4ZvdiXkDW4B4\n9O1VGhBMvy9DIN9GliF8yilnqQKBgQDyFRMvnXtgYj6T0IhAj8wEVuQy4V1MpLEb\neV8bmyX03vYm9h4fdd/OntrSwx1IfDP+q76SX4L2y6dlBoO3vS2HJ/9EbDeK35/C\nscwiToaoVljVZwGOqjkeMr1fH9DvQVBX8pupgVQtG3lERzl0GUgJBsMUID9JbkSp\nDSPq0t8pFwKBgGTJ9YoxPSXjVyM/6aXatlFgoslKQsceRfY8DzMR80OaR7+SVgIa\nwATV4PriqTQCMagKhFvY2WcCKdm+CY0GaymCYR7vFtk7Ii7nG+mN6SjB+5PAKXik\nIQQGn+QnyawxCQl/SOcGX7HaHPbqsYQTk4wOu2I40GOYpQZQQ9sq+7pxAoGBAIWk\nhNcAhaAMHKfVs6KQv/yVS52bNLqfIPcd5heDa0zn2dRggvizRj73C67W8E+X4cxy\nW97Kw64jd+IZ2pWQ5pV6yz2m0HLmSXheV2eJGmXMZXZKS13LM4UsVccx9VJgKE6l\nLLJDJ4lPZX8AIwOpAU+aYA+4TbfoHBeHnZCBoZk5AoGBANjr5irUefz0Q9N1qUWi\nfX9phEKXRxPt9RQlx3TQuUh64kfoaIOlOZrT70GlFjPwgi2OSDzY7LFsSw1YNU3E\n++GeVXcxcjEAAUrxbfBS89sN8Qv3GSe/Kl3TH9MJ0cEfmbmH/UOw9ktqpPDJBHBF\n8PGSHAkwT18oMazDVlTJqlNc\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qthge@data-log-fb39d.iam.gserviceaccount.com",
    "client_id": "111119234437985151574",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qthge%40data-log-fb39d.iam.gserviceaccount.com"
}

cred = credentials.Certificate(key)
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://data-log-fb39d.firebaseio.com/'
})
module_dir = os.path.dirname(__file__)
model_path = os.path.join(module_dir, '../../static/json/model.pkl')
load_model = joblib.load(model_path)
inverse_path = os.path.join(module_dir, '../../static/json/inverse.pkl')
lp = joblib.load(inverse_path)

@login_required
def index(request):
    global p1_wh, p2_wh, p3_wh, p4_wh, cur_wh, watt_data
    _m = Meter.objects.all()
    module_dir = os.path.dirname(__file__)
    bill_path = os.path.join(module_dir, '../../static/json/setting.json')
    data_bill = open(bill_path , 'r')  
    data = json.load(data_bill)
    dbill = data["bill-cycle"]
    dunit = data["unit"]
    today = unixtime_to_readable(time.time())
    month = today[0]+"-"+today[1].zfill(2)
    day = today[0]+"-"+today[1].zfill(2)+"-"+today[2].zfill(2)
    daily_p = [cur_wh[0]/1000,cur_wh[1]/1000,cur_wh[2]/1000,cur_wh[3]/1000]
    now_p1 = watt_data[-1]["P1"]
    now_p2 = watt_data[-1]["P2"]
    now_p3 = watt_data[-1]["P3"]
    now_p4 = watt_data[-1]["P4"]
    now_p = [now_p1, now_p2, now_p3, now_p4]
    bill_cost, bill_date =  get_cur_wh()
    data_cur = (bill_cost+cur_wh[0])/1000
    cost = calculate_cost_energy(data_cur)
    return render(request, "index.html", {"energy": json.dumps(list(watt_data)), 
                                          "daily_p": json.dumps(daily_p),
                                          "now_p": json.dumps(now_p),
                                          "meter": _m, "dbill": dbill, "unit":dunit,
                                          'bill_cost': cost
                                        })

@login_required
def setting(request):
    module_dir = os.path.dirname(__file__)  
    ip_path = os.path.join(module_dir, '../../static/json/ip.txt')
    bill_path = os.path.join(module_dir, '../../static/json/setting.json')
    data_ip = open(ip_path , 'r')   
    data_bill = open(bill_path , 'r')  
    data = json.load(data_bill)
    dbill = data["bill-cycle"]
    dunit = data["unit"]
    dlive = data["live"]
    ip = data_ip.read()
    _m = Meter.objects.all()
    _range = range(1,32)
    return render(request, "setting.html",{"meter": _m, "ip_now" : ip, 
                                           "range": _range, "dbill":dbill, "unit": dunit, "live":dlive})

@login_required
def history(request):
    global p1_wh, p2_wh, p3_wh, p4_wh, cur_wh, backup
    column = []
    _m = Meter.objects.all()
    p1_val, p2_val, p3_val, p4_val = [[] for i in range(4)]
    for k in p1_wh['day']:
        column.append(k)
    if backup:
        column = sorted(column)[-6:]
    else:
        column = sorted(column)[-7:]
    print(column)
    for c in column:
        p1_val.append(p1_wh['day'][c]/1000)
        p2_val.append(p2_wh['day'][c]/1000)
        p3_val.append(p3_wh['day'][c]/1000)
        p4_val.append(p4_wh['day'][c]/1000)

    today = unixtime_to_readable(time.time())
    today_s = today[0]+'-'+today[1].zfill(2)+'-'+today[2].zfill(2)
    if today_s not in column and backup:
        column.append(today_s)
        p1_val.append(cur_wh[0]/1000)
        p2_val.append(cur_wh[1]/1000)
        p3_val.append(cur_wh[2]/1000)
        p4_val.append(cur_wh[3]/1000)
    data_7days = get_data_last_7days()[0]

    today_d = datetime.strptime(today_s, '%Y-%m-%d')
    today_new = today_d.strftime('%d/%m/%Y')
    firstdate_d = datetime.strptime(column[0], '%Y-%m-%d')
    firstdate_new = firstdate_d.strftime('%d/%m/%Y')
    lastdate_d = datetime.strptime(column[-1], '%Y-%m-%d')
    lastdate_new = lastdate_d.strftime('%d/%m/%Y')

    sum_p1_val = round(sum(p1_val),2)
    sum_p2_val = round(sum(p2_val),2)
    sum_p3_val = round(sum(p3_val),2)
    sum_p4_val = round(sum(p4_val),2)
    cost_7_days = calculate_cost_energy(sum_p1_val)
    return render(request,"history.html",{"d_col": json.dumps(column),"meter": _m,
                                          "p1_val": json.dumps(p1_val),
                                          "p2_val": json.dumps(p2_val),
                                          "p3_val": json.dumps(p3_val),
                                          "p4_val": json.dumps(p4_val),
                                          "firstdate": firstdate_new,
                                          "lastdate": lastdate_new,
                                          "today":today_new,
                                          "sum_p1_val": sum_p1_val,
                                          "sum_p2_val": sum_p2_val,
                                          "sum_p3_val": sum_p3_val,
                                          "sum_p4_val": sum_p4_val,
                                          "cost7days":cost_7_days,
                                          "data": json.dumps(data_7days)})
    

@login_required    
def estimation(request):
    global watt_data, load_model, lp, p1_wh, p2_pre_wh, p3_pre_wh, p4_pre_wh, cur_wh, cur_d1m
    _m = Meter.objects.all()
    column = []
    p1_val, p2_val, p3_val, p4_val = [[] for i in range(4)]
    for k in p1_wh['day']:
        column.append(k)
    column = sorted(column)[-6:]
    for c in column:
        p1_val.append(p1_wh['day'][c]/1000)
        p2_val.append(p2_pre_wh['day'][c]/1000)
        p3_val.append(p3_pre_wh['day'][c]/1000)
        p4_val.append(p4_pre_wh['day'][c]/1000)

    today = unixtime_to_readable(time.time())
    today_s = today[0]+'-'+today[1].zfill(2)+'-'+today[2].zfill(2)
    if today_s not in column and len(cur_d1m) != 0:
        column.append(today_s)
        X_test = pd.DataFrame({'time':cur_d1m['time'],'P':cur_d1m['p1'],'Q':cur_d1m['q1']})
        predictions1 = load_model.predict(X_test)
        y_pd = convert_values(predictions1, lp).to_dict()
        p1_val.append(cur_wh[0]/1000)
        p2_val.append(sum(y_pd['ap1'].values())/1000)
        p3_val.append(sum(y_pd['ap2'].values())/1000)
        p4_val.append(sum(y_pd['ap3'].values())/1000)
    firstdate_d = datetime.strptime(column[0], '%Y-%m-%d')
    firstdate_new = firstdate_d.strftime('%d/%m/%Y')
    data_7days = get_data_last_7days()[0]
    data_7days_pre = get_data_last_7days()[1]
    today_d = datetime.strptime(today_s, '%Y-%m-%d')
    today_new = today_d.strftime('%d/%m/%Y')
    lastdate_d = datetime.strptime(column[-1], '%Y-%m-%d')
    lastdate_new = lastdate_d.strftime('%d/%m/%Y')

    keep_app = []
    p_pre = []
    q_pre = []
    for i in range(len(watt_data)):
        t = watt_data[i]['time']
        p_pre.append(watt_data[i]['P1'])
        q_pre.append(watt_data[i]['Q1'])
        dt = datetime.fromtimestamp(int(t))
        keep_app.append(int(dt.strftime('%H')))
    X_test = pd.DataFrame({'time':keep_app,'P':p_pre,'Q':q_pre})
    predictions1 = load_model.predict(X_test)
    y_pd = convert_values(predictions1, lp).to_dict()
    now_p1 = watt_data[-1]['P1']
    now_p2 = y_pd["ap1"][len(y_pd['ap1'])-1]
    now_p3 = y_pd["ap2"][len(y_pd['ap2'])-1]
    now_p4 = y_pd["ap3"][len(y_pd['ap3'])-1]
    now_p = [now_p1, now_p2, now_p3, now_p4]
    # print(watt_data)
    return render(request, "estimation.html",{"energy": json.dumps(list(watt_data)), 
    									 "now_p": json.dumps(now_p),
    									 "d_col": json.dumps(column),
    									 "p1_val": json.dumps(p1_val),
                                         "p2_val": json.dumps(p2_val),
                                         "p3_val": json.dumps(p3_val),
                                         "p4_val": json.dumps(p4_val),
                                         "today":today_new,
                                         "firstdate": firstdate_new,
                                         "lastdate": lastdate_new,
                                         "data": json.dumps(data_7days),
                                         "data_pre": json.dumps(data_7days_pre),
                                         "pred": json.dumps(y_pd), "meter": _m})

def convert_values(predictions1, lp_in):
    inverse_fn = lambda lbl: lp_in.inverse_transform(lbl)
    y_pred = inverse_fn(predictions1.flatten().astype(int)).toarray()
    ap1_pd = pd.DataFrame({i:y_pred[:,i] for i in range(4)})
    ap2_pd = pd.DataFrame({i:y_pred[:,i+4] for i in range(4)})
    ap3_pd = pd.DataFrame({i:y_pred[:,i+8] for i in range(4)})
    y_pred_ev = pd.DataFrame({})
    y_pred_ev['ap1'] = list(pd.Series(ap1_pd.columns[np.where(ap1_pd==1)[1]]))
    y_pred_ev['ap2'] = list(pd.Series(ap2_pd.columns[np.where(ap2_pd==1)[1]]))
    y_pred_ev['ap3'] = list(pd.Series(ap3_pd.columns[np.where(ap3_pd==1)[1]]))
    k_mean = list([[2.15210285e+00, 8.52438422e+00, 3.83718099e-02],
        [9.24644536e+01, 1.00098512e+02, 5.70881799e-01],
        [1.25115337e+02, 1.31406327e+02, 7.60770557e-01],
        [6.09337188e+01, 6.66166802e+01, 3.79289921e-01]]), list([[1.14160129e+02, 1.16585378e+02, 6.91351893e-01],
        [8.47389373e+02, 2.90199956e+02, 3.84198640e+00],
        [3.44046524e+02, 1.19216976e+02, 1.54038705e+00],
        [1.24179946e+03, 1.74602829e+02, 5.32716895e+00]]), list([[3.54255695e+00, 5.38882404e+01, 2.29437080e-01],
        [1.82461380e+03, 1.44850806e+01, 7.62384242e+00],
        [5.49765080e+02, 4.28571073e+02, 3.11881945e+00],
        [2.82815214e+03, 5.19177953e-02, 1.17964208e+01]])
    k_mean = np.array(k_mean)
    p_val = np.array([k_mean[i][:,0] for i in range(3)])
    y_pd = c2v(y_pred_ev, p_val)
    return y_pd
    
def c2v(X, lbl):
    columns = X.columns
    val = np.copy(X).astype(float)
    for i, l in enumerate(lbl):
        _k = val[:, i]
        for j in range(4):
            val[_k==j, i] = l[j]
    return pd.DataFrame(val, columns=columns)

def unixtime_to_readable(unixtime):
    tz = pytz.timezone('Asia/Bangkok')
    now = datetime.fromtimestamp(unixtime, tz)
    month = now.month
    year = now.year
    day = now.day
    hour = now.strftime('%H')
    minute = now.strftime('%M')
    second = now.strftime('%S')
    return (str(year), str(month), str(day), hour, minute, second)

def get_current_predict(request):
    global load_model, lp, watt_data
    p_pre = [watt_data[-1]['P1']]
    q_pre = [watt_data[-1]['Q1']]
    t = watt_data[-1]['time']
    dt = datetime.fromtimestamp(int(t))
    keep_app = [int(dt.strftime('%H'))]
    X_test = pd.DataFrame({'time':keep_app,'P':p_pre,'Q':q_pre})
    predictions1 = load_model.predict(X_test)
    y_pd = convert_values(predictions1, lp)
    data = y_pd.to_dict()
    return JsonResponse(data)

def get_current_energy(request):
    global cur_wh, p1_wh, p2_wh, p3_wh, p4_wh, watt_data    
    print("cur"+str(cur_wh[0]))
    bill_date = get_data_setting()
    today = unixtime_to_readable(time.time())
    month = today[0]+"-"+today[1].zfill(2)
    day = today[0]+"-"+today[1].zfill(2)+'-'+today[2].zfill(2)
    bill_cost, bill_date =  get_cur_wh()
    data_cur = (bill_cost+cur_wh[0])/1000
    cost = calculate_cost_energy(data_cur)
    now_p1 = watt_data[-1]["P1"]
    now_p2 = watt_data[-1]["P2"]
    now_p3 = watt_data[-1]["P3"]
    now_p4 = watt_data[-1]["P4"]
    now_p = [now_p1, now_p2, now_p3, now_p4]
    data = {
        'daily_cur': [cur_wh[0]/1000, cur_wh[1]/1000, cur_wh[2]/1000, cur_wh[3]/1000],
        'now_p' : now_p,
        'bill_cost': cost
    }
    return JsonResponse(data)

def save_json(keep_day, d_1m, d_30m, d_1hr, p1_wh_val, p2_wh_val, p3_wh_val, p4_wh_val, list_column):
    global p1_wh, p2_wh, p3_wh, p4_wh 
    print("open save json")
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, '../../static/json/data_energy/')
    time_data = unixtime_to_readable(keep_day[0])
    year = time_data[0]
    month = time_data[1]
    day = time_data[2]
    dic_data = {}
    time = ["1m", "30m", "1hr"]
    keep_json = {"sum_p1" : round(p1_wh_val,2), "sum_p2" : round(p2_wh_val,2), "sum_p3" : round(p3_wh_val,2), "sum_p4" : round(p4_wh_val,2)}
    for t in time:
        dic_data = {}
        data = {}
        for n in list_column:
            data[n] = list(eval("d_{}[n]".format(t)))
        dic_data[t] = data
        keep_json.update(dic_data)         
    file_name = year+"-"+month.zfill(2)+"-"+day.zfill(2)
    with open(file_path+file_name+".json", 'w+') as f:
        json.dump(keep_json, f, ensure_ascii=False)
    print("upload json "+file_name)
    d = year+"-"+month.zfill(2)+"-"+day.zfill(2)
    val = [keep_json['sum_p1'],keep_json['sum_p2'],keep_json['sum_p3'],keep_json['sum_p4']]
    p1_wh['day'][d], p2_wh['day'][d], p3_wh['day'][d], p4_wh['day'][d] = val

def keep_data_realtime(d, wh, time_data, keep_day, keep_hour, keep_minute, check30):
    global cur_d1m, cur_d1hr, cur_d30m, cur_wh, watt_data
    ref = db.reference('energy')
    print("get old value prepare at "+str(int(time.time())))
    if(len(time_data)>0):
        get_start = time_data[len(time_data)-1]
    else:
        keep_date = unixtime_to_readable(time.time())
        new_date = keep_date[2]+'-'+keep_date[1]+'-'+keep_date[0]
        if(platform.system() == "Windows"):
            get_start = int(time.mktime(datetime.strptime(new_date, "%d-%m-%Y").timetuple()))
        else:
            get_start = int(time.mktime(datetime.strptime(new_date, "%d-%m-%Y").timetuple())) - 25200
    result = ref.order_by_child('time').start_at(int(get_start)).end_at(int(time.time())).get()
    for val in result.values():
        time_value = val["time"]
        keep_day, keep_hour, keep_minute, check30, d, wh, time_data = check_condition(val, time_value,keep_day, keep_hour, keep_minute, check30, d, wh, time_data)

    print("real time start at "+str(int(time.time())))
    time_before = 0
    day_before = ''
    count = 0
    while(True):
        result = ref.order_by_child('time').limit_to_last(1).get()
        
        for val in result.values():
            time_value = val["time"]
            if(time_before != time_value):
                watt_data.popleft()
                watt_data.append(list(result.values())[0])
                today = unixtime_to_readable(time_value)
                print(today)
                
                time_before = time_value
                keep_day, keep_hour, keep_minute, check30, d, wh, time_data = check_condition(val, time_value,keep_day, keep_hour, keep_minute, check30, d, wh, time_data)
                cur_d1m = d[0]
                cur_d30m = d[1]
                cur_d1hr = d[2]
                cur_wh = wh
                bill_cycle = get_data_setting()
                day_now = today[0]+"-"+today[1].zfill(2)+'-'+today[2].zfill(2)
                if bill_cycle == today[2]:
                    sum_wh, bill_date = get_cur_wh()
                    cost = calculate_cost_energy(sum_wh/1000)                    
                    json_data = {min(bill_date)+"_"+max(bill_date):cost}
                    save_bill_cost(json_data, True)
                time.sleep(1)

def get_data_setting():
    module_dir = os.path.dirname(__file__)  
    setting_json_path = os.path.join(module_dir, '../../static/json/setting.json')
    json_setting_data = open(setting_json_path , 'r')  
    data_json = json.load(json_setting_data)
    bill_date = data_json['bill-cycle']
    return bill_date

def backup_from_firebase():
    global backup
    print("Start Backup")
    backup = True
    t_start = datetime.now()
    d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur = (pd.DataFrame() for i in range(6))
    p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value = (0 for i in range(4))
    d = [d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur]
    wh = [p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value]
    time_data = []

    ref = db.reference('energy')
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, '../../static/json/data_energy')
    list_of_files = sorted(glob.glob(file_path+'/*')) # * means all if need specific format then *.csv
    if(len(list_of_files) > 0):
        all_file = []
        for f in list_of_files:
            _, s = os.path.split(f)
            _d = int(os.path.splitext(s)[0].split('-')[2])
            _m = os.path.splitext(s)[0].split('-')[1]
            _y = os.path.splitext(s)[0].split('-')[0]
            new_date = str(_d).zfill(2)+'-'+_m.zfill(2)+'-'+_y
            print(new_date)
            if(platform.system() == "Windows"):
                all_file.append(int(time.mktime(datetime.strptime(new_date, "%d-%m-%Y").timetuple()))+86400)
            else:
                all_file.append(int(time.mktime(datetime.strptime(new_date, "%d-%m-%Y").timetuple()))-25200+86400)
        latest_file = max(all_file)
        print("last="+str(unixtime_to_readable(latest_file)))
        start = latest_file
    else:
        start = 1549386000 # started at 06-02-2019

    endt = int(time.time())
    print("end", unixtime_to_readable(endt))
    print("start", unixtime_to_readable(start))
    result = ref.order_by_child('time').start_at(int(start)).end_at(int(endt)).get()  
    print("get firebase complete")
    check30 = True  
    for val in result.values():
        time_value = val["time"]
        keep_date = unixtime_to_readable(time_value) 
        keep_day = keep_date[2]
        keep_hour = keep_date[3]
        keep_minute = keep_date[4]  
        break
    for val in result.values():
        time_value = val["time"]
        keep_day, keep_hour, keep_minute, check30, d, wh, time_data = check_condition(val, time_value,keep_day, keep_hour, keep_minute, check30, d, wh, time_data)

    print("-----------------------------Complete--------------------------------------")
    print(datetime.now()-t_start)
    keep_data_realtime(d, wh, time_data, keep_day, keep_hour, keep_minute, check30)

def check_condition(val, time_value, keep_day, keep_hour, keep_minute, check30, d, wh, time_data):
    d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur = d
    p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value = wh
    list_column = ["p1", "p2", "p3", "p4", "s1", "s2", "s3", "s4", "q1", "q2", "q3", "q4", "i1", "i2", "i3", "i4", "pf1", "time"]
    p1_value = val["P1"]
    p2_value = val["P2"]
    p3_value = val["P3"]
    p4_value = val["P4"]
    q1_value = val["Q1"]
    q2_value = val["Q2"]
    try:
        q3_value = val["Q3"]
    except:
        q3_value = 0
    q4_value = val["Q4"]
    i1_value = val["I1"]
    i2_value = val["I2"]
    i3_value = val["I3"]
    i4_value = val["I4"]
    s1_value = val["S1"]
    s2_value = val["S2"]
    s3_value = val["S3"]
    s4_value = val["S4"]
    pf1_value = val["PF1"]
    p1_wh_value += val["P1_wh"]*3
    p2_wh_value += val["P2_wh"]*3
    p3_wh_value += val["P3_wh"]*3
    p4_wh_value += val["P4_wh"]*3
    if(keep_minute != unixtime_to_readable(time_value)[4]):
        list_val = []
        for col in d_1m_cur:
            if(col != "time"):                  
                list_val.append(round(mean(d_1m_cur[col]),2))
        # new > add append time_value
        list_val.append(time_value)
        d_1m = d_1m.append(pd.DataFrame([list_val], columns=list_column), ignore_index=True)
        d_1m_cur = pd.DataFrame()
        keep_minute = unixtime_to_readable(time_value)[4]

    if(unixtime_to_readable(time_value)[4] == "30" and check30 == True):
        print("30minutes")
        list_val = []
        for col in d_30m_cur:
            if(col != "time"):  
                list_val.append(round(mean(d_30m_cur[col]),2))
        # new > add append time_value
        list_val.append(time_value)
        d_30m = d_30m.append(pd.DataFrame([list_val], columns=list_column), ignore_index=True)
        d_30m_cur = pd.DataFrame()
        check30 = False
    elif(unixtime_to_readable(time_value)[4] != "30" and check30 == False):
        print("re value")
        check30 = True

    if(keep_hour != unixtime_to_readable(time_value)[3]):
        list_val_1hr = []
        for col in d_1hr_cur:
            if(col != "time"):  
                list_val_1hr.append(round(mean(d_1hr_cur[col]),2))
        # new > add append time_value
        list_val_1hr.append(time_value)
        d_1hr = d_1hr.append(pd.DataFrame([list_val_1hr], columns=list_column), ignore_index=True)

        d_1hr_cur = pd.DataFrame()

        list_val_30m = []
        for col in d_30m_cur:
            if(col != "time"):  
                list_val_30m.append(round(mean(d_30m_cur[col]),2))
        # new > add append time_value
        list_val_30m.append(time_value)
        d_30m = d_30m.append(pd.DataFrame([list_val_30m], columns=list_column), ignore_index=True)
        d_30m_cur = pd.DataFrame()
        keep_hour = unixtime_to_readable(time_value)[3]

    if(keep_day != unixtime_to_readable(time_value)[2]):
        print("change day")
        save_json(time_data, d_1m, d_30m, d_1hr, p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value, list_column)
        time_data = []
        d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur = (pd.DataFrame() for i in range(6))
        p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value = (0 for i in range(4))
        keep_day = unixtime_to_readable(time_value)[2]

    time_data.append(time_value)
    list_values = [p1_value, p2_value, p3_value, p4_value, s1_value, s2_value, s3_value, s4_value,\
                    q1_value, q2_value, q3_value, q4_value, i1_value, i2_value, i3_value, i4_value, pf1_value, time_value]
    d_1m_cur = d_1m_cur.append(pd.DataFrame([list_values], columns=list_column), ignore_index=True)
    d_30m_cur = d_30m_cur.append(pd.DataFrame([list_values], columns=list_column), ignore_index=True)
    d_1hr_cur = d_1hr_cur.append(pd.DataFrame([list_values], columns=list_column), ignore_index=True)
    d = [d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur]
    wh = [p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value]

    return(keep_day, keep_hour, keep_minute, check30, d, wh, time_data)

def get_cur_wh():
    module_dir = os.path.dirname(__file__) 
    bill_cost_path = os.path.join(module_dir, '../../static/json/bill_cost.json')
    file_path = os.path.join(module_dir, '../../static/json/data_energy/')
    json_bill_data = open(bill_cost_path , 'r')  
    data_json = json.load(json_bill_data)
    last_file = max(data_json.items())[0]
    last_day = last_file.split('_')[1]
    start = False
    sum_wh = 0
    bill_date = []
    list_of_files = sorted(glob.glob(file_path+'*'))
    for files in list_of_files:
        _, s = os.path.split(files)
        date_time = os.path.splitext(s)[0]
        if(start):
            with open(file_path+s) as f:
                data = json.load(f)
            sum_wh += data['sum_p1']
            bill_date.append(date_time)
        if(last_day+'.json' == s):
            start = True
    return sum_wh, bill_date

def set_data():
    global p1_wh, p2_wh, p3_wh, p4_wh, watt_data, p2_pre_wh, p3_pre_wh, p4_pre_wh
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, '../../static/json/data_energy/')
    list_of_files = sorted(glob.glob(file_path+'*'))
    old_month = ''
    old_year = ''
    if(len(list_of_files) > 0):
        for files in list_of_files:
            _, s = os.path.split(files)
            _d = os.path.splitext(s)[0].split('-')[2]
            _m = os.path.splitext(s)[0].split('-')[1]
            _y = os.path.splitext(s)[0].split('-')[0]
            new_day = _y+'-'+_m.zfill(2)+'-'+_d.zfill(2)
            with open(file_path+s) as f:
                data = json.load(f)
                p1_wh['day'][new_day] = data['sum_p1']
                p2_wh['day'][new_day] = data['sum_p2']
                p3_wh['day'][new_day] = data['sum_p3']
                p4_wh['day'][new_day] = data['sum_p4']

                # predict
                X_test = pd.DataFrame({'time':data['1m']['time'],'P':data['1m']['p1'],'Q':data['1m']['q1']})
                predictions1 = load_model.predict(X_test)
                y_pd = convert_values(predictions1, lp).to_dict()
                p2_pre_wh['day'][new_day] = sum(y_pd['ap1'].values())
                p3_pre_wh['day'][new_day] = sum(y_pd['ap2'].values())
                p4_pre_wh['day'][new_day] = sum(y_pd['ap3'].values())
                
    ref = db.reference('energy')
    result = ref.order_by_child('time').limit_to_last(500).get() # 30 mins
    value_array = list(result.values())
    # print(value_array)
    watt_data = deque(value_array)

def calculate_cost_energy(energy):
    module_dir = os.path.dirname(__file__)  
    bill_path = os.path.join(module_dir, '../../static/json/setting.json')
    data_bill = open(bill_path , 'r')  
    data = json.load(data_bill)
    dlive = data["live"]
    if(dlive == "Home"):
        unit_first_150 = 3.2484
        unit_more_151 = 4.2218
        unit_more_400 = 4.4217
        Ft = -0.116
        service = 38.22
        cost_150_unit, cost_more_151_unit, cost_more_400_unit = 0, 0, 0
        energy_remain = energy - 150
        if energy_remain > 0:
            cost_150_unit = round(150 * unit_first_150,2)
            if energy_remain <= 400:
                cost_more_151_unit = round(energy_remain * unit_more_151,2)
            else:
                energy_remain = energy_remain - 400
                cost_more_151_unit = round(400 * unit_more_151,2)
                cost_more_400_unit = round(energy_remain * unit_more_400,2)
        else:
            cost_150_unit = energy * unit_first_150
        cost_sum = cost_150_unit+cost_more_151_unit+cost_more_400_unit+service
        cost_Ft = round(energy * Ft,2)
        vat = round((cost_sum + cost_Ft)*(7/100),2)
        last_cost = round(cost_sum + cost_Ft + vat,2)
    elif(dlive == "Dorm"):
        dunit = float(data["unit"])
        last_cost = round(energy*dunit,2)
    return last_cost

def save_bill_cost(json_data, update_json=False):
    module_dir = os.path.dirname(__file__)  
    json_path = os.path.join(module_dir, '../../static/json/')
    file_name = json_path+"bill_cost.json"
    
    if(update_json):
        bill_cost = open(file_name , 'r')  
        data = json.load(bill_cost)
        data.update(json_data)
        with open(file_name, "w+") as f:
            json.dump(data, f, ensure_ascii=False)
    else:
        keep_json = {}
        for j in json_data:
            keep_json.update(j)
        with open(file_name, "w+") as f:
            json.dump(keep_json, f, ensure_ascii=False)

def get_data_last_7days():
    today = date.today()
    last_7days = []
    for i in range(0,7):
        last_7days.append(str(today - timedelta(days=i)))
    last_7days.reverse()
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, '../../static/json/data_energy/')
    list_column = ["p1", "p2", "p3", "p4", "s1", "s2", "s3", "s4", "q1", "q2", "q3", "q4", "i1", "i2", "i3", "i4", "pf1", "time"]
    keep_data = pd.DataFrame()
    exist_file, list_val = [], []
    check_today = False
    no_anyday = False
    query_time = ""
    today = unixtime_to_readable(time.time())
    today_s = today[0]+'-'+today[1].zfill(2)+'-'+today[2].zfill(2)
    for _date in last_7days:
        print(_date)
        file_name = file_path+_date+".json"
        if(os.path.isfile(file_name)):
            exist_file.append(file_name)
        elif(date == today_s):
            check_today = True
        else:
            no_anyday = True
    if no_anyday:
        file_ = sorted(os.listdir(file_path), reverse=True)
        exist_file = sorted(file_[:7])
        string = file_path
        exist_file = [string + x for x in exist_file]
    if(1 <= len(exist_file) <= 7 or check_today):
        query_time = "1m"
    else:
        error = "No Date in Database"
        data = {"error" : error}
        return data
    if(query_time):            
        keep_dict = defaultdict(list)
        for file_name in exist_file:
            data_file = open(file_name , 'r')       
            data = json.load(data_file)
            for column in list_column:
                keep_dict[column] += data[query_time][column]
        if(check_today):
            for column in list_column:
                keep_dict[column] += cur_d1m[column].values.tolist()
        for column in list_column:
            list_val.append(keep_dict[column])
        keep_data = keep_data.append(pd.DataFrame([list_val], columns=list_column), ignore_index=True)
    data = {}
    data_pre = {}
    for column in list_column:
        data[column] = list(keep_data[column])

    X_test = pd.DataFrame({'time':data['time'][0],'P':data['p1'][0],'Q':data['q1'][0]})
    predictions1 = load_model.predict(X_test)
    y_pd = convert_values(predictions1, lp).to_dict()
    return [data, y_pd]

def get_date_return_json(request):
    global backup
    if request.method == "GET" and request.is_ajax():
        all_date = request.GET.get('all_date')
        date_list = json.loads(all_date)
        module_dir = os.path.dirname(__file__)  
        file_path = os.path.join(module_dir, '../../static/json/data_energy/')
        list_column = ["p1", "p2", "p3", "p4", "s1", "s2", "s3", "s4", "q1", "q2", "q3", "q4", "i1", "i2", "i3", "i4", "pf1", "time"]
        keep_data = pd.DataFrame()
        exist_file, list_val = [], []
        check_today = False
        query_time = ""
        today = unixtime_to_readable(time.time())
        today_s = today[0]+'-'+today[1].zfill(2)+'-'+today[2].zfill(2)
        for date in date_list:
            # print(date)
            file_name = file_path+date+".json"
            if(os.path.isfile(file_name)):
                exist_file.append(file_name)
            elif(date == today_s and backup):
                check_today = True
            else:
                print("NO DAY")
        if(1 <= len(exist_file) <= 7 or check_today):
            query_time = "1m"
        elif(len(exist_file) >= 8 and len(exist_file) <= 30):
            query_time = "30m"
        elif(len(exist_file) > 30):
            query_time = "1hr"
        else:
            error = "No Date in Database"
            data = {"error" : error}
            return JsonResponse(data)
        if(query_time):            
            keep_dict = defaultdict(list)
            for file_name in exist_file:
                data_file = open(file_name , 'r')       
                data = json.load(data_file)
                for column in list_column:
                    keep_dict[column] += data[query_time][column]
            if(check_today):
                for column in list_column:
                    keep_dict[column] += cur_d1m[column].values.tolist()
            for column in list_column:
                list_val.append(keep_dict[column])
            keep_data = keep_data.append(pd.DataFrame([list_val], columns=list_column), ignore_index=True)
        data = {}
        for column in list_column:
            data[column] = list(keep_data[column])  
        X_test = pd.DataFrame({'time':data['time'][0],'P':data['p1'][0],'Q':data['q1'][0]})
        predictions1 = load_model.predict(X_test)
        y_pd = convert_values(predictions1, lp).to_dict()
        data['pre_ap1'] = list(y_pd['ap1'].values())
        data['pre_ap2'] = list(y_pd['ap2'].values())
        data['pre_ap3'] = list(y_pd['ap3'].values())

        column = []
        _m = Meter.objects.all()
        p1_val, p2_val, p3_val, p4_val = [[] for i in range(4)]
        for k in date_list:
            if k in p1_wh['day']:
                column.append(k)
        column = sorted(column)
        for c in column:
            p1_val.append(p1_wh['day'][c]/1000)
            p2_val.append(p2_wh['day'][c]/1000)
            p3_val.append(p3_wh['day'][c]/1000)
            p4_val.append(p4_wh['day'][c]/1000)
        if check_today :
            column.append(today_s)
            p1_val.append(cur_wh[0]/1000)
            p2_val.append(cur_wh[1]/1000)
            p3_val.append(cur_wh[2]/1000)
            p4_val.append(cur_wh[3]/1000)
        keep_data2 = {'p1_val':p1_val, 'p2_val':p2_val, 'p3_val':p3_val, 'p4_val':p4_val, 'd_col':column,
                      'sum_p1_val':round(sum(p1_val),2), 'sum_p2_val':round(sum(p2_val),2),
                      'sum_p3_val':round(sum(p3_val),2), 'sum_p4_val':round(sum(p4_val),2),
                      'cost_by_date':calculate_cost_energy(round(sum(p1_val),2))
                     }
        for k in keep_data2:
            data[k] = keep_data2[k]
        
    else:
        print(request)
    return JsonResponse(data)

th1 = threading.Thread(target = set_data).start()
# th2 = threading.Thread(target = backup_from_firebase).start()
