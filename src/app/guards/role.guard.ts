import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    console.warn('No token found. Redirecting to login.');
    router.navigate(['/login']);
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    console.log('Decoded Token:', decodedToken); // Verifica el contenido del token

    const expectedRole = route.data['expectedRole'];
    console.log('Expected Role:', expectedRole); // Verifica el rol esperado

    if (expectedRole && decodedToken.role !== expectedRole) {
      console.warn(`Access denied. User role: ${decodedToken.role}, Expected role: ${expectedRole}`);
      router.navigate(['/unauthorized']); // Redirige si el rol no coincide
      return false;
    }

    return true; // Permite el acceso si el rol coincide
  } catch (err) {
    console.error('Error decoding token:', err);
    router.navigate(['/login']);
    return false;
  }
};