import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inyecta el Router

  // Verifica si hay un token en localStorage o sessionStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    return true; // Permite el acceso
  } else {
    router.navigate(['/login']);
    return false; // Bloquea el acceso
  }
};
