import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UsersService } from '../../services/users.service';
import { PopoverModule } from 'primeng/popover';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employees-table',
  imports: [TableModule, PopoverModule, FormsModule],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.css'
})
export class EmployeesTableComponent {
  firstName: string = '';
  lastName: string = '';
  role: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  employees: any[] = [];
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.usersService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: (err) => console.error('Error al obtener empleados', err)
    });
  }

  onRegisterEmployee() {
    const newEmployee = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role
    };
  
    this.authService.registerAdmin(newEmployee).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);
        this.messageService.add({
          severity: 'info',
          summary: 'Registro exitoso',
          detail: this.role + ' registrado correctamente',
          life: 3000
        })
        this.loadEmployees();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
          life: 3000
        })
      }
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
