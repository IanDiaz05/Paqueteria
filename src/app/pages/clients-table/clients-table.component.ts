import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importa el plugin
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-clients-table',
  imports: [TableModule],
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.css',
})
export class ClientsTableComponent implements OnInit {
  clients: any[] = [];

  constructor(
    private usersService: UsersService,
  ) {}

  ngOnInit() {
    this.usersService.getClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Error al obtener clientes', err)
    });
  }

  // exportar a Excel
  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.clients); // Convierte los datos a una hoja de Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    XLSX.writeFile(workbook, 'clientes.xlsx'); // Descarga el archivo
  }

  // exportar a PDF
  exportToPDF(): void {
    const doc = new jsPDF();
    const columns = ['ID', 'Nombre', 'Correo']; // Encabezados de la tabla
    const rows = this.clients.map(client => [client.id, `${client.fname} ${client.lname}`, client.email]); // Filas de la tabla
  
    doc.text('Lista de Clientes', 14, 10); // Título del PDF
    autoTable(doc, { // Usa el plugin registrado manualmente
      head: [columns],
      body: rows,
      startY: 20
    });
  
    doc.save('clientesTabla.pdf'); // Descarga el archivo
  }
}
