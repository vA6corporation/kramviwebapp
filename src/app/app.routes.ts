import { Routes } from '@angular/router'

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home/home.component').then(x => x.HomeComponent)
    },
    {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
    },
    {
        path: 'sales',
        loadChildren: () => import('./sales/sales.routes').then(m => m.routes)
    },
    {
        path: 'turns',
        loadChildren: () => import('./turns/turns.routes').then(m => m.routes)
    },
    {
        path: 'posStandard',
        loadChildren: () => import('./pos-standard/pos-standard.routes').then(m => m.routes)
    },
    {
        path: 'posFood',
        loadChildren: () => import('./pos-food/pos-food.routes').then(m => m.routes)
    },
    {
        path: 'proformas',
        loadChildren: () => import('./proformas/proformas.routes').then(m => m.routes)
    },
    {
        path: 'boards',
        loadChildren: () => import('./boards/boards.routes').then(m => m.routes)
    },
    {
        path: 'expenses',
        loadChildren: () => import('./expenses/expenses.routes').then(m => m.routes)
    },
    {
        path: 'products',
        loadChildren: () => import('./products/products.routes').then(m => m.routes)
    },
    {
        path: 'customers',
        loadChildren: () => import('./customers/customers.routes').then(m => m.routes)
    },
    {
        path: 'reports',
        loadChildren: () => import('./reports/reports.routes').then(m => m.routes)
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.routes)
    },
    {
        path: 'banks',
        loadChildren: () => import('./banks/banks.routes').then(m => m.routes)
    },
    {
        path: 'tools',
        loadChildren: () => import('./tools/tools.routes').then(m => m.routes)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes').then(m => m.routes)
    },
]
