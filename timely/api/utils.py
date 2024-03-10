from django.db.models import Model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status 
from rest_framework.response import Response
import functools

def check_if_instance_exists(model: Model, model_pk_field_name):    
    def _check_if_instance_exists_wrapper(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                model.objects.get(id=kwargs[model_pk_field_name])
            except ObjectDoesNotExist:
                return Response(
                    status=status.HTTP_404_NOT_FOUND,
                    data="User doesn't exist"
                )   
            response = func(*args, **kwargs)
            return response
        return wrapper
    return _check_if_instance_exists_wrapper