import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(public sidebarService: SidebarService){}

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
