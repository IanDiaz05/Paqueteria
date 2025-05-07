import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarToggled = false;

  toggleSidebar(): void {
    this.sidebarToggled = !this.sidebarToggled;
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');

    if (this.sidebarToggled) {
      body.classList.add('sidebar-toggled');
      sidebar?.classList.add('toggled');
    } else {
      body.classList.remove('sidebar-toggled');
      sidebar?.classList.remove('toggled');
    }
  }
}
