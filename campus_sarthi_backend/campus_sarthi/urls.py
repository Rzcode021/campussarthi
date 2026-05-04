from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/crew/', include('crew.urls')),
    path('api/resources/', include('resources.urls')),
    path('api/news/', include('news.urls')),
    path('api/bookmarks/', include('bookmarks.urls')),
    path('api/study-materials/', include('study_materials.urls')),
    # Admin API routes
    path('api/admin/', include('accounts.admin_urls')),
    path('api/admin/', include('companies.admin_urls')),
    path('api/admin/', include('crew.admin_urls')),
    path('api/admin/', include('study_materials.admin_urls')),
    path('api/admin/', include('news.admin_urls')),
    path('api/admin/', include('resources.admin_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
