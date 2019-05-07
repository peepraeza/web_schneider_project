from django.conf.urls import url
from django.urls import path, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from .views import views, user_views, setting_views

urlpatterns = [

    # path('signup/', views.signup, name='signup'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/change_email/', user_views.change_email, name='change_email'),
    path('accounts/change_email/done/', user_views.change_email_done),
    path('accounts/password_resets/', auth_views.PasswordResetView.as_view(form_class=user_views.EmailValidationOnForgotPassword), name='password_resets'),
    path('', views.index, name='home'),
    path('logout/', auth_views.LogoutView.as_view(next_page='index.html'), name='logout'),

    # common views
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.index),
    url(r'^index', views.index),
    url(r'^setting/', views.setting),
    url(r'^estimation/', views.estimation),
    url(r'^history/', views.history),

    # ajax views
    url(r'^ajax/get_current_energy/$', views.get_current_energy),
    url(r'^ajax/get_current_predict/$', views.get_current_predict),
    url(r'^ajax/get_date_return_json/$', views.get_date_return_json),

    # setting views
    url(r'^edit_channel/', setting_views.edit_channel),
    url(r'^edit_ip/', setting_views.edit_ip),
    url(r'^edit_bill/', setting_views.edit_bill),

    # user views
    # url(r'^signin/', user_views.signin),
    # url(r'^login/', user_views.login),
    # url(r'^makelogin/', user_views.make_login),
    url(r'^logout/', user_views.logout),
    # url(r'^user/change_password/', user_views.change_password),
    # url(r'^user/change_email/', user_views.change_email),
]