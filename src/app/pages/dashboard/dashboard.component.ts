import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { MinicardComponent } from '../../components/minicard/minicard.component';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

@Component({
  standalone: true,
  imports: [
    CommonModule, MinicardComponent, TableModule, ChartModule
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = {
    totalShipments: 0,
    delivered: 0,
    popularSize: '',
    pending: 0,
  };
  recentShipments: any[] = [];
  loading: boolean = true;

  // grafica de pie, distribucion de tamanos de paquete
  data: any;
  chartOptions: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
    this.pieChart();
  }

  pieChart(): void {
    this.dashboardService.getSizeDistribution().subscribe({
      next: (data) => {
        const labels = data.map((d: any) => d.size);
        const values = data.map((d: any) => d.total);
        // tamano mas popular
        this.dashboardData.popularSize = labels[0];
  
        this.data = {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: ['#8C43F7', '#EC2358', '#D5E923'],
              hoverBackgroundColor: ['#9C61F1', '#EB547D', '#DDEB60']
            }
          ]
        };
  
        this.chartOptions = {
          plugins: {
            legend: {
              position: 'top'
            }
          }
        };
      },
      error: (err) => {
        console.error('Error al cargar la distribución de tamaños:', err);
      }
    });
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