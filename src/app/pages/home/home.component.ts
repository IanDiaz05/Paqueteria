import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 constructor(private renderer: Renderer2) { }
  ngOnInit() {
    this.renderer.removeClass(document.body, 'bg-gradient-custom');
    
  }


}
