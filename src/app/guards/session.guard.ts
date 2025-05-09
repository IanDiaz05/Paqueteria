import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    console.warn('No token found. Redirecting to login.');
    router.navigate(['/login']);
    return false;
  }

  return true; // Permite el acceso si hay un token
};