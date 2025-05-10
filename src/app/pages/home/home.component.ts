import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  trackingNumber: string = '';

  onTrack() {
    // Lógica para rastrear el paquete
    console.log('Número de guía:', this.trackingNumber);
  }
}
