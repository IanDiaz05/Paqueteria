import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  trackingNumber: string = '';
  userName: string = '';

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || 'Usuario';
  }

  onTrack() {
    // Lógica para rastrear el paquete
    console.log('Número de guía:', this.trackingNumber);
  }

  logout(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Hasta luego, ' + this.userName,
      life: 3000
    });
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}