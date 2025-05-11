import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const messageService = inject(MessageService);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    messageService.add({
      severity: 'error',
      summary: 'Acceso Denegado',
      detail: 'Debes iniciar sesión para acceder a esta página.',
      life: 3000
    });
    router.navigate(['/home']);
    return false;
  }

  return true; // Permite el acceso si hay un token
};