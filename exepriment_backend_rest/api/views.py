from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Label, Experiment, Data, Compound
from api.serializers import ExperimentSerializer, LabelSerializer, UploadSerializer, ExperimentDataSerializer, \
    DeleteExperimentSerializer, CompoundSerializer, ExperimentCompoundSerializer, IDSerializer, ScatterDataSerializer


class UploadResponseView(APIView):
    """
    Accept upload request
    @Method post
    @Params - name of experiment and 3 required files
    @Response - simple success message or raise error
    """
    def post(self, request):
        serializer = UploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create(serializer.validated_data)
        return Response({"Success"}, status=status.HTTP_200_OK)


class LabelView(APIView):

    """
    List all labels in db
    @Method get
    @Params - none
    @Response - list of all lables
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        labels = Label.objects.all()
        serializer = LabelSerializer(labels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class ExperimentView(APIView):

    """
    List all experiments
    @Method get
    @Params - none
    @Response - list of all experiments
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        experiments = Experiment.objects.all()
        serializer = ExperimentSerializer(experiments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ExperimentDataView(APIView):

    """
    List all experiments data, this is created for testing
    @Method get
    @Params - none
    @Response - list of all experiment data
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = Data.objects.all()[:100]
        serializer = ExperimentDataSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ExperimentDeleteView(APIView):

    """
    Delete experiment by id
    @Method post
    @Params - experiment id
    @Response - success message
    """
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = DeleteExperimentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.delete(serializer.validated_data)
        return Response({"message": "success"}, status=status.HTTP_200_OK)



class CompoundView(APIView):

    """
    List all unique compound id
    @Method get
    @Params - experiment id
    @Response - list of compound ids in experiment
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = IDSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        experimentData = list(Data.objects
                              .filter(experiment__id=serializer.validated_data['id'])
                              .order_by('compound')
                              .values_list('compound', flat=True)
                              .distinct())
        return Response(experimentData, status=status.HTTP_200_OK)


class ExperimentDataScatterView(APIView):

    """
    Experiment data filtered by id, range of compounds and label
    @Method get
    @Params - none
    @Response - list of all experiments
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = ScatterDataSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        data = Data.objects.filter(experiment_id=serializer.validated_data['experiment_id'],
                                   compound__id__gte=serializer.validated_data['compound_start_id'],
                                   compound__id__lte=serializer.validated_data['compound_end_id'],
                                   compound__label_id=serializer.validated_data['label_id'])
        serializer = ExperimentDataSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DefaultView(APIView):

    """
    Simple message to show home page
    @Method get
    @Params - none
    @Response - success
    """
    def get(self, request):
        return Response({"message": "Success"}, status=status.HTTP_200_OK)
