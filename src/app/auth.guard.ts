import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inyecta el Router

  // Verifica si hay un token en el localStorage
  if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
    return true; // Permite el acceso
  } else {
    router.navigate(['/login']); // Redirige al login
    return false; // Bloquea el acceso
  }
};
