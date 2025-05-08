import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
  
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.message === 'Usuario registrado correctamente') {
          this.router.navigateByUrl('/login');
        } else {
          this.errorMessage = 'Error inesperado al registrar el usuario.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Error al registrar el usuario';
      }
    });
  }
}
