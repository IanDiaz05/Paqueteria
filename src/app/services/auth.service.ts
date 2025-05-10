import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // registrar cliente
  register(user: { email: string, password: string, firstName: string, lastName: string }) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // registrar admnin o delivery
  registerAdmin(user: { email: string, password: string, firstName: string, lastName: string, role: string }) {
    return this.http.post(`${this.apiUrl}/registerEmployee`, user);
  }

  login(user: { email: string, password: string, rememberMe: boolean }) {
    return this.http.post<{ token: string, name: string }>(`${this.apiUrl}/login`, user);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }

}