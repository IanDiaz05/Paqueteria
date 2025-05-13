import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { PackagesService } from '../../services/packages.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule, DialogModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  trackingNumber: string = '';
  visible: boolean = false;
  trackingData: any = null;

  constructor(private packagesService: PackagesService) {}

  showDialog() {
    this.visible = true;
  }

  onTrack() {
    if (!this.trackingNumber) {
      console.error('Número de guía vacío');
      return;
    }

    this.packagesService.trackPackage(this.trackingNumber).subscribe({
      next: (data) => {
        this.trackingData = data;
        this.visible = true; // Mostrar el diálogo con los datos
      },
      error: (err) => {
        console.error('Error al rastrear el paquete:', err);
        this.trackingData = null; // Limpiar datos en caso de error
        this.visible = true; // Mostrar el diálogo con mensaje de error
      }
    });
  }
}
