import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  constructor(public sidebarService: SidebarService) {}

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
