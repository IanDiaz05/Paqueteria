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
  isLoading: boolean = false; // Para deshabilitar el botón durante el login

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
  
    // Crear un objeto user con email y password
    const user = {
      email: this.email,
      password: this.password
    };
  
    this.auth.login(user).subscribe({
      next: (response) => {
        if (this.rememberMe) {
          localStorage.setItem('token', response.token);
        } else {
          sessionStorage.setItem('token', response.token);
        }
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        console.error('Error en el login:', error);
      }
    });
  }
}
