import { Component, Renderer2 } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { PageTitleService } from '../../services/page-title.service';

@Component({
  selector: 'app-topbar',
  imports: [NgClass],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  isDarkMode: boolean = false;
  page_title: string = '';
  userName: string = '';
  
  constructor(
    public sidebarService: SidebarService,
    private authService: AuthService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || 'Usuario';
    this.pageTitleService.title$.subscribe((title) => {
      this.page_title = title;
    });
  }

  // menu vista de movil
  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleTheme(): void {
    const sidebar = document.getElementById('accordionSidebar');
    const topbar = document.getElementById('topbar');
    const content = document.getElementById('content');
    const footer = document.getElementById('footer');

    this.isDarkMode = !this.isDarkMode; // Alterna el estado
    if (this.isDarkMode) {
      this.renderer.removeClass(sidebar, 'bg-gradient-custom');
      this.renderer.addClass(sidebar, 'bg-gradient-custom-dark');
      this.renderer.addClass(topbar, 'bg-gray-900');
      this.renderer.addClass(content, 'bg-gray-700');
      this.renderer.addClass(footer, 'bg-gray-700');
    } else {
      this.renderer.removeClass(sidebar, 'bg-gradient-custom-dark');
      this.renderer.addClass(sidebar, 'bg-gradient-custom');
      this.renderer.removeClass(topbar, 'bg-gray-900');
      this.renderer.removeClass(content, 'bg-gray-700');
      this.renderer.removeClass(footer, 'bg-gray-700');
    }
  }
}
