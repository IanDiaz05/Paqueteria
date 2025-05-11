import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { StatCardComponent } from '../../components/shared/stat-card/stat-card.component';

@Component({
  standalone: true,
  imports: [
    CommonModule, StatCardComponent
    // NgClass y otras directivas necesarias
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = {
    totalShipments: 0,
    delivered: 0
  };
  recentShipments: any[] = [];
  loading: boolean = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });

    this.dashboardService.getRecentShipments().subscribe({
      next: (data) => {
        this.recentShipments = data;
      },
      error: (err) => console.error('Error loading recent shipments:', err)
    });
  }

  trackByShipmentId(index: number, shipment: any): any {
    return shipment.id;
  }
}