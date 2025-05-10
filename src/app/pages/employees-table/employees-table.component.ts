import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ClienteTableService } from '../../services/cliente-table.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importa el plugin

@Component({
  selector: 'app-employees-table',
  imports: [TableModule],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.css'
})
export class EmployeesTableComponent {
  employees: any[] = [];
  constructor(private clientService: ClienteTableService) {}

  ngOnInit() {
    this.clientService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: (err) => console.error('Error al obtener clientes', err)
    });
  }

  // exportar a Excel
  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.employees); // Convierte los datos a una hoja de Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');
    XLSX.writeFile(workbook, 'empleados.xlsx'); // Descarga el archivo
  }

  // exportar a PDF
  exportToPDF(): void {
    const doc = new jsPDF();
    const columns = ['ID', 'Nombre', 'Correo', 'Rol']; // Encabezados de la tabla
    const rows = this.employees.map(emp => [emp.id, `${emp.fname} ${emp.lname}`, emp.email, emp.role]); // Filas de la tabla
  
    doc.text('Lista de Epleados', 14, 10); // Título del PDF
    autoTable(doc, { // Usa el plugin registrado manualmente
      head: [columns],
      body: rows,
      startY: 20
    });
  
    doc.save('empleadosTabla.pdf'); // Descarga el archivo
  }
}
