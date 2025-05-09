import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  constructor(private renderer: Renderer2){}

  ngOnInit(): void {
    this.renderer.removeAttribute(document.body, 'id');
    this.renderer.setAttribute(document.body, 'class', 'bg-gradient-primary');
  }
}
