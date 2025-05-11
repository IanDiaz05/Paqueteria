import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { inject } from '@angular/core';
import { PageTitleService } from './services/page-title.service';
import { ClientsTableComponent } from './pages/clients-table/clients-table.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { sessionGuard } from './guards/session.guard';
import { roleGuard } from './guards/role.guard';
import { EmployeesTableComponent } from './pages/employees-table/employees-table.component';
import { HelpComponent } from './pages/help/help.component';
import { EnviosComponent } from './pages/envios/envios.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [

    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [sessionGuard],
        children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {   path: 'dashboard',
            component: DashboardComponent,
            canActivate: [roleGuard],
            data: { expectedRole: 'admin' },
            resolve: {
            title: () => {
                const pageTitleService = inject(PageTitleService);
                pageTitleService.setTitle('Dashboard');
                return true;
            }
            }
        },
        {   path: 'clientes',
            component: ClientsTableComponent,
            canActivate: [roleGuard],
            data: { expectedRole: 'admin' },
            resolve: {
            title: () => {
                const pageTitleService = inject(PageTitleService);
                pageTitleService.setTitle('Clientes');
                return true;
            }
            }
        },
        {   path: 'empleados',
            component: EmployeesTableComponent,
            canActivate: [roleGuard],
            data: { expectedRole: 'admin' },
            resolve: {
            title: () => {
                const pageTitleService = inject(PageTitleService);
                pageTitleService.setTitle('Colaboradores');
                return true;
            }
            }
        },
        // otras rutas internas
        ],
    },

    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent }
            
        ],
    },

    {
        path: '',
        component: HomeLayoutComponent,
        children: [
            { path: 'home', component: HomeComponent},
            { path: 'enviar', component: EnviosComponent},
            { path: 'acerca-de', component: HelpComponent}
        ]
    },

    { path: '**', redirectTo: 'home' } // Redirige a login si la ruta no existe


];
