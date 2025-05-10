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
}
