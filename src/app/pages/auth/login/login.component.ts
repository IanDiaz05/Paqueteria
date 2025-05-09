import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
  
    const user = {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    };
  
    this.auth.login(user).subscribe({
      next: (response: any) => {
        this.isLoading = false;
  
        // Almacenar el token en local o sesion
        if (this.rememberMe) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userName', response.name);
        } else {
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userName', response.name);
        }
  
        console.log('Inicio de sesión exitoso:', response.message);
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
        console.error('Error en el login:', error);
      }
    });
  }
}
