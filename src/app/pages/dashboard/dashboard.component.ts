import { Component } from '@angular/core';
import { MinicardComponent } from '../../components/minicard/minicard.component';

@Component({
  selector: 'app-dashboard',
  imports: [MinicardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
}
