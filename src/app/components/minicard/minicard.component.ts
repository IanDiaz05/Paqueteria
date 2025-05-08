import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-minicard',
  imports: [],
  templateUrl: './minicard.component.html',
  styleUrl: './minicard.component.css'
})
export class MinicardComponent {
  @Input() borderColor: string = 'primary';
  @Input() title: string = 'Título';
  @Input() content?: string = 'Contenido';
  @Input() icon: string = 'fas fa-info-circle';
}
