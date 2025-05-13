import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000'; // Ajusta según tu configuración

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }

  getRecentShipments(limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages/recent?limit=${limit}`);
  }

  getSizeDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages/size-distribution`);
  }
  getStatusDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages/status-distribution`);
  }

  getMonthlyTrend(): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages/monthly-trend`);
  }

  getDeliveryPerformance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/delivery/performance`);
  }
}