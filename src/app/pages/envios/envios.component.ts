import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { PackagesService } from '../../services/packages.service';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-envios',
  imports: [DialogModule, RouterLink, FormsModule],
  templateUrl: './envios.component.html',
  styleUrl: './envios.component.css'
})
export class EnviosComponent {
  constructor(
    private packagesService: PackagesService,
    private messageService: MessageService
  ) {}

  package = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    reference: '',
    description: '',
    weight: 0,
    size: '',
    declared_value: 0,
    is_fragile: false,
    delivery_notes: ''
  };

  terms_accepted: boolean = false;
  visible: boolean = false;

  onNewPackage() {
    if (!this.terms_accepted) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Términos no aceptados',
        detail: 'Por favor, acepta los términos y condiciones para continuar.',
        life: 3000
      });
      return;
    }
  
    // Obtener el token del almacenamiento
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró un token válido. Por favor, inicia sesión.',
        life: 3000
      });
      return;
    }
  
    // Decodificar el token para obtener el user_id
    let user_id: number;
    try {
      const decodedToken: any = jwtDecode(token);
      user_id = decodedToken.id; // Asegúrate de que el campo `id` exista en el token
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Token inválido. Por favor, inicia sesión nuevamente.',
        life: 3000
      });
      return;
    }
  
    // Preparar los datos del paquete
    const newPackage = { ...this.package, user_id, is_fragile: this.package.is_fragile ? 1 : 0 };
  
    // Enviar los datos al backend
    this.packagesService.newPackage(newPackage).subscribe({
      next: (response: any) => {
        console.log('Paquete registrado correctamente:', response.message);
        this.messageService.add({
          severity: 'info',
          summary: 'Paquete registrado correctamente',
          detail: `Tu número de guía es: ${response.trackingNumber}`,
          life: 5000
        });
        this.resetForm(); // Limpia el formulario después de registrar
      },
      error: (error) => {
        console.error('Error al registrar el paquete:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al registrar el paquete',
          detail: 'Por favor, verifica los datos ingresados.',
          life: 3000
        });
      }
    });
  }

  private resetForm(): void {
    this.package = {
      fname: '',
      lname: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      reference: '',
      description: '',
      weight: 0,
      size: '',
      declared_value: 0,
      is_fragile: false,
      delivery_notes: ''
    };
    this.terms_accepted = false;
    this.visible = false; // Cierra el diálogo si está abierto
  }

  showDialog() {
    this.visible = true;
  }
}
