import { Component, OnInit } from '@angular/core';
import { ClienteTableService } from '../../services/cliente-table.service';

@Component({
  selector: 'app-clients-table',
  imports: [],
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.css',
})
export class ClientsTableComponent implements OnInit {
  clients: any[] = [];

  constructor(
    private clientService: ClienteTableService,
  ) {}

  ngOnInit() {
    this.clientService.getClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Error al obtener clientes', err)
    });
  }

}
