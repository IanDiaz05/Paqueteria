import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  newPackage(newPackage: any) {
    return this.http.post(`${this.apiUrl}/packages`, newPackage); // Asegúrate de que `this.apiUrl` sea correcto
  }
}
