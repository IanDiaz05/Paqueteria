import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

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
      router.navigate(['/unauthorized']); // Redirige si el rol no coincide
      return false;
    }

    return true; // Permite el acceso si el rol coincide
  } catch (err) {
    router.navigate(['/login']);
    return false;
  }
};