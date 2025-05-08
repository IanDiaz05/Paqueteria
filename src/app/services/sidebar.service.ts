import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  sidebarToggled = false;

  constructor() {}

  toggleSidebar(): void {
    this.sidebarToggled = !this.sidebarToggled;
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');

    if (this.sidebarToggled) {
      body.classList.add('sidebar-toggled');
      sidebar?.classList.add('toggled');
      this.collapseSidebar();
    } else {
      body.classList.remove('sidebar-toggled');
      sidebar?.classList.remove('toggled');
    }
  }

  // Close any open menu accordions when window is resized below 768px
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = window.innerWidth;

    if (width < 768) {
      this.collapseSidebar();
    }

    if (width < 480 && !this.sidebarToggled) {
      document.body.classList.add('sidebar-toggled');
      document.querySelector('.sidebar')?.classList.add('toggled');
      this.collapseSidebar();
    }
  }

  private collapseSidebar(): void {
    const collapses = document.querySelectorAll('.sidebar .collapse');
    collapses.forEach((collapse) => {
      (collapse as HTMLElement).style.display = 'none';
    });
  }
}
