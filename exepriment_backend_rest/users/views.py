from rest_framework.views import APIView
from rest_framework.response import Response


class LogoutView(APIView):

    """
    Logout view to remove token from cookie
    """
    def post(self, request):
        response = Response()
        response.delete_cookie('token')
        response.data = {'message': 'success'}
        return response
