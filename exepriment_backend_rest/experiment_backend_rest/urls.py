from django.contrib import admin
from django.urls import path, include
from api import urls as api_urls
from users import urls as auth_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_urls)),
    path('', include(api_urls)),
    path('auth/', include(auth_urls)),
]
