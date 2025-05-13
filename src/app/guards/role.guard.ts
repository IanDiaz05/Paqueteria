import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const messageService = inject(MessageService);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const expectedRole = route.data['expectedRole'];

    if (expectedRole && decodedToken.role !== expectedRole) {
      console.warn(`Access denied. User role: ${decodedToken.role}, Expected role: ${expectedRole}`);
      messageService.add({
        severity: 'error',
        summary: 'Acceso Denegado',
        detail: 'Debes tener el rol ' + expectedRole + ' para acceder a esta página.',
        life: 3000
      });
      router.navigate(['/home']); // Redirige si el rol no coincide
      return false;
    }

    return true; // Permite el acceso si el rol coincide
  } catch (err) {
    router.navigate(['/login']);
    return false;
  }
};