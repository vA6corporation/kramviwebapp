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
        path: 'subscription',
        loadChildren: () => import('./subscription/subscription.routes').then(m => m.routes)
    },
    {
        path: 'sales',
        loadChildren: () => import('./sales/sales.routes').then(m => m.routes)
    },
    {
        path: 'credits',
        loadChildren: () => import('./credits/credits.routes').then(m => m.routes)
    },
    {
        path: 'remissionGuides',
        loadChildren: () => import('./remission-guides/remission-guides.routes').then(m => m.routes)
    },
    {
        path: 'creditNotes',
        loadChildren: () => import('./credit-notes/credit-notes.routes').then(m => m.routes)
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
        path: 'inventories',
        loadChildren: () => import('./inventories/inventories.routes').then(m => m.routes)
    },
    {
        path: 'incidents',
        loadChildren: () => import('./incidents/incidents.routes').then(m => m.routes)
    },
    {
        path: 'customers',
        loadChildren: () => import('./customers/customers.routes').then(m => m.routes)
    },
    {
        path: 'purchases',
        loadChildren: () => import('./purchases/purchases.routes').then(m => m.routes)
    },
    {
        path: 'purchaseOrders',
        loadChildren: () => import('./purchase-orders/purchase-orders.routes').then(m => m.routes)
    },
    {
        path: 'reports',
        loadChildren: () => import('./reports/reports.routes').then(m => m.routes)
    },
    {
        path: 'providers',
        loadChildren: () => import('./providers/providers.routes').then(m => m.routes)
    },
    {
        path: 'carriers',
        loadChildren: () => import('./carriers/carriers.routes').then(m => m.routes)
    },
    {
        path: 'paymentOrders',
        loadChildren: () => import('./payment-orders/payment-orders.routes').then(m => m.routes)
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.routes)
    },
    {
        path: 'paymentMethods',
        loadChildren: () => import('./payment-methods/payment-methods.routes').then(m => m.routes)
    },
    {
        path: 'banks',
        loadChildren: () => import('./banks/banks.routes').then(m => m.routes)
    },
    {
        path: 'tables',
        loadChildren: () => import('./tables/tables.routes').then(m => m.routes)
    },
    {
        path: 'printers',
        loadChildren: () => import('./printers/printers.routes').then(m => m.routes)
    },
    {
        path: 'offices',
        loadChildren: () => import('./offices/offices.routes').then(m => m.routes)
    },
    {
        path: 'activities',
        loadChildren: () => import('./activities/activities.routes').then(m => m.routes)
    },
    {
        path: 'tools',
        loadChildren: () => import('./tools/tools.routes').then(m => m.routes)
    },
    {
        path: 'biller',
        loadChildren: () => import('./biller/biller.routes').then(m => m.routes)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes').then(m => m.routes)
    },
]
