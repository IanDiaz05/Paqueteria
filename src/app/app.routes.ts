import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard } from './auth.guard';
import { inject } from '@angular/core';
import { PageTitleService } from './services/page-title.service';

export const routes: Routes = [

    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        { path: 'dashboard', component: DashboardComponent, resolve: {
            title: () => {
                const pageTitleService = inject(PageTitleService);
                pageTitleService.setTitle('Dashboard');
                return true;
            }
        } },
        // otras rutas internas
        ],
    },

    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
        ],
    },

    { path: '**', redirectTo: 'dashboard' } // Redirige a login si la ruta no existe


];
