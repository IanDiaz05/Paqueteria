import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.css'
})
export class HomeNavbarComponent {
  trackingNumber: string = '';
  userName: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || '';
  }

  logout(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Hasta luego, ' + this.userName,
      life: 3000
    });
    this.authService.logout();
    window.location.reload();
    this.router.navigate(['/home']);
  }
}
