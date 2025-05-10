import { Component, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  trackingNumber: string = '';
  userName: string = 'Usuario'; // <-- Nombre de usuario a mostrar

  constructor(private renderer: Renderer2) { }

  onTrack() {
    // Lógica para rastrear el paquete
    console.log('Número de guía:', this.trackingNumber);
  }

  logout() {
    // Lógica para cerrar sesión
    this.userName = ''; // Limpiar el nombre de usuario
    console.log('Sesión cerrada');
    // Aquí puedes limpiar datos, redirigir, etc.
  }
}