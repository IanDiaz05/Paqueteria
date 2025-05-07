import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    // si no hay uri, redirige a dashboard
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},

    // declarar rutas
    {path: 'dashboard', component: DashboardComponent},
];
