import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
// En stat-card.component.ts
  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() icon: string = '';
  @Input() colorClass: string = 'bg-primary';
}