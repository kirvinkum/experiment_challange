from django.urls import path

from api.views import LabelView, UploadResponseView, ExperimentView, DefaultView, ExperimentDataView, \
    ExperimentDeleteView, CompoundView, ExperimentDataScatterView

urlpatterns = [
    path('', DefaultView.as_view()),
    path('label/list', LabelView.as_view()),
    path('experiment/list', ExperimentView.as_view()),
    path('experiment/delete', ExperimentDeleteView.as_view()),
    path('compound/list', CompoundView.as_view()),
    path('experiment/data', ExperimentDataView.as_view()),
    path('experiment/data/scatter', ExperimentDataScatterView.as_view()),
    path('upload', UploadResponseView.as_view()),
]
