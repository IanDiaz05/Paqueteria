import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getClients() {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }

  getEmployees() {
    return this.http.get<any[]>(`${this.apiUrl}/employees`);
  }

  updateEmployee(employeeId: number, updatedData: { fname: string; lname: string; email: string; role: string }) {
    return this.http.put(`${this.apiUrl}/employees/${employeeId}`, updatedData);
  }

  deleteEmployee(employeeId: number) {
    return this.http.delete(`${this.apiUrl}/employees/${employeeId}`);
  }
}
