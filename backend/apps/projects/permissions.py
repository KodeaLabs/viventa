"""
Permission classes for the Projects module.
"""

from rest_framework import permissions


class IsProjectAdmin(permissions.BasePermission):
    """Allow write access only to users with project_admin role or staff."""

    message = "Solo los administradores de proyecto tienen acceso."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and (
            request.user.is_project_admin or request.user.is_staff
        )


class IsProjectManager(permissions.BasePermission):
    """Allow only the manager of a specific project (or staff)."""

    message = "Solo el administrador asignado al proyecto tiene acceso."

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # obj could be a Project or have a .project FK
        project = obj if hasattr(obj, "manager") else getattr(obj, "project", None)
        if project is None:
            return False
        return project.manager == request.user or request.user.is_staff


class IsBuyerOfContract(permissions.BasePermission):
    """Allow access only to the buyer of the contract."""

    message = "Solo el comprador del contrato tiene acceso."

    def has_object_permission(self, request, view, obj):
        contract = obj if hasattr(obj, "buyer") else getattr(obj, "contract", None)
        if contract is None:
            return False
        return contract.buyer == request.user
