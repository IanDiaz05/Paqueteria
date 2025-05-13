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
    // Datos para gráficos
  statusData: any;
  monthlyData: any;
  performanceData: any;
  
  // Configuraciones
  statusOptions: any;
  monthlyOptions: any;
  performanceOptions: any;

  // Estadísticas rápidas
  dashboardStats: any = {};

  // grafica de pie, distribucion de tamanos de paquete
  data: any;
  chartOptions: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
    this.pieChart();
    this.loadStatusDistribution();
    this.loadMonthlyTrend();
    this.loadDeliveryPerformance();
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


    loadStatusDistribution(): void {
    this.dashboardService.getStatusDistribution().subscribe({
      next: (data) => {
        this.statusData = {
          labels: data.map((d: any) => d.status),
          datasets: [{
            data: data.map((d: any) => d.total),
            backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384', '#36A2EB', '#9966FF'],
            hoverBackgroundColor: ['#4BE0E0', '#FFEE86', '#FF7394', '#46B2FB', '#A976FF']
          }]
        };
        
        this.statusOptions = {
          plugins: {
            legend: { position: 'right' },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = data[context.dataIndex].percentage;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        };
      },
      error: (err) => console.error('Error loading status distribution:', err)
    });
  }

  loadMonthlyTrend(): void {
    this.dashboardService.getMonthlyTrend().subscribe({
      next: (data) => {
        this.monthlyData = {
          labels: data.map((d: any) => d.month),
          datasets: [
            {
              label: 'Registrados',
              data: data.map((d: any) => d.registered),
              borderColor: '#36A2EB',
              tension: 0.4,
              fill: false
            },
            {
              label: 'Entregados',
              data: data.map((d: any) => d.delivered),
              borderColor: '#4BC0C0',
              tension: 0.4,
              fill: false
            }
          ]
        };

        this.monthlyOptions = {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        };

        // Calcular crecimiento
        if (data.length >= 2) {
          const last = data[data.length - 1];
          const prev = data[data.length - 2];
          this.dashboardStats.growthRate = 
            Math.round(((last.registered - prev.registered) / prev.registered * 100));
        }
      },
      error: (err) => console.error('Error loading monthly trend:', err)
    });
  }

  loadDeliveryPerformance(): void {
    this.dashboardService.getDeliveryPerformance().subscribe({
      next: (data) => {
        this.performanceData = {
          labels: data.map((d: any) => d.delivery_name),
          datasets: [
            {
              label: 'Entregados',
              data: data.map((d: any) => d.delivered),
              backgroundColor: '#4BC0C0'
            },
            {
              label: 'Total Asignados',
              data: data.map((d: any) => d.total),
              backgroundColor: '#FFCE56'
            }
          ]
        };

        this.performanceOptions = {
          responsive: true,
          scales: {
            x: { stacked: true },
            y: { stacked: true }
          },
          plugins: {
            tooltip: {
              callbacks: {
                afterBody: (context: any) => {
                  const index = context[0].dataIndex;
                  return `Tiempo promedio: ${data[index].avg_hours} horas`;
                }
              }
            }
          }
        };

        // Mejor repartidor
        if (data.length > 0) {
          this.dashboardStats.on = data[0].delivery_name;
          this.dashboardStats.deliveryRate = 
            Math.round((data[0].delivered / data[0].total) * 100);
        }
      },
      error: (err) => console.error('Error loading delivery performance:', err)
    });
  }
  dailyData: any;
  dailyOptions: any;

loadDailyChart(): void {
  this.dashboardService.getDailyTrend().subscribe({
    next: (data) => {
      console.log('Datos diarios:', data);
      
      this.dailyData = {
        labels: data.map((d: any) => d.day_short), // Usamos el formato corto
        datasets: [
          {
            label: 'Registrados',
            data: data.map((d: any) => d.registered),
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Entregados',
            data: data.map((d: any) => d.delivered),
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
            fill: true
          }
        ]
      };

      this.dailyOptions = {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: (context: any) => {
                const index = context.dataIndex;
                return `Tasa de entrega: ${data[index].delivery_rate}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad de paquetes'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Días'
            }
          }
        }
      };
    },
    error: (err) => console.error('Error loading daily trend:', err)
  });
}

  trackByShipmentId(index: number, shipment: any): any {
    return shipment.id;
  }


}