import { Component, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';
import { HomeFooterComponent } from '../../components/home-footer/home-footer.component';

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, HomeFooterComponent, HomeNavbarComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {
  userName: string = '';
  
  constructor(
    private renderer: Renderer2,
    private router: Router
  ){}

  ngOnInit(): void {
    this.renderer.removeAttribute(document.body, 'id');
    this.renderer.setAttribute(document.body, 'class', 'bg-gradient-danger');
    this.renderer.setAttribute(document.body, 'id', 'page-top');
  }
}
