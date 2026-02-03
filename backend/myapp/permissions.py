from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        # Admin is just a role, not necessarily a superuser
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'userprofile') and
            request.user.userprofile.role == 'ADMIN'
        )
