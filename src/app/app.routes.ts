import { Routes } from '@angular/router';

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
        path: 'turns',
        loadChildren: () => import('./turns/turns.routes').then(m => m.routes)
    },
    {
        path: 'posStandard',
        loadChildren: () => import('./pos-standard/pos-standard.routes').then(m => m.routes)
    },
    {
        path: 'products',
        loadChildren: () => import('./products/products.routes').then(m => m.routes)
    },
    {
        path: 'boards',
        loadChildren: () => import('./boards/boards.routes').then(m => m.routes)
    },
    {
        path: 'charge',
        loadChildren: () => import('./sales/sales.routes').then(m => m.routes)
    },
    {
        path: 'preSales',
        loadChildren: () => import('./pre-sales/pre-sales.routes').then(m => m.routes)
    },
    {
        path: 'tables',
        loadChildren: () => import('./tables/tables.routes').then(m => m.routes)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.routes)
    },
    {
        path: 'rooms',
        loadChildren: () => import('./rooms/rooms.routes').then(m => m.routes)
    },
    {
        path: 'receptions',
        loadChildren: () => import('./receptions/receptions.routes').then(m => m.routes)
    },
    {
        path: 'posCopy',
        loadChildren: () => import('./pos-copy/pos-copy.routes').then(m => m.routes)
    },
    {
        path: 'posFastFood',
        loadChildren: () => import('./pos-fast-food/pos-fast-food.routes').then(m => m.routes)
    },
    {
        path: 'prePosFastFood',
        loadChildren: () => import('./pre-pos-fast-food/pre-pos-fast-food.routes').then(m => m.routes)
    },
    {
        path: 'credits',
        loadChildren: () => import('./credits/credits.routes').then(m => m.routes)
    },
    {
        path: 'promotions',
        loadChildren: () => import('./promotions/promotions.routes').then(m => m.routes)
    },
    {
        path: 'coupons',
        loadChildren: () => import('./coupons/coupons.routes').then(m => m.routes)
    },
    {
        path: 'inventories',
        loadChildren: () => import('./inventories/inventories.routes').then(m => m.routes)
    },
    {
        path: 'lots',
        loadChildren: () => import('./lots/lots.module').then(m => m.LotsModule)
    },
    {
        path: 'inventorySupplies',
        loadChildren: () => import('./inventory-supplies/inventory-supplies.routes').then(m => m.routes)
    },
    {
        path: 'incidents',
        loadChildren: () => import('./incidents/incidents.routes').then(m => m.routes)
    },
    {
        path: 'moves',
        loadChildren: () => import('./moves/moves.routes').then(m => m.routes)
    },
    {
        path: 'customers',
        loadChildren: () => import('./customers/customers.routes').then(m => m.routes)
    },
    {
        path: 'events',
        loadChildren: () => import('./events/events.routes').then(m => m.routes)
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.routes)
    },
    {
        path: 'reports',
        loadChildren: () => import('./reports/reports.routes').then(m => m.routes)
    },
    {
        path: 'invoices',
        loadChildren: () => import('./invoices/invoices.routes').then(m => m.routes)
    },
    {
        path: 'carriers',
        loadChildren: () => import('./carriers/carriers.routes').then(m => m.routes)
    },
    {
        path: 'creditNotes',
        loadChildren: () => import('./credit-notes/credit-notes.routes').then(m => m.routes)
    },
    {
        path: 'remissionGuides',
        loadChildren: () => import('./remission-guides/remission-guides.routes').then(m => m.routes)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes').then(m => m.routes)
    },
    {
        path: 'expenses',
        loadChildren: () => import('./expenses/expenses.routes').then(m => m.routes)
    },
    {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.routes').then(m => m.routes)
    },
    {
        path: 'supplies',
        loadChildren: () => import('./supplies/supplies.routes').then(m => m.routes)
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
        path: 'purchaseSupplies',
        loadChildren: () => import('./purchase-supplies/purchase-supplies.routes').then(m => m.routes)
    },
    {
        path: 'providers',
        loadChildren: () => import('./providers/providers.routes').then(m => m.routes)
    },
    {
        path: 'printers',
        loadChildren: () => import('./printers/printers.routes').then(m => m.routes)
    },
    {
        path: 'events',
        loadChildren: () => import('./events/events.routes').then(m => m.routes)
    },
    {
        path: 'specialties',
        loadChildren: () => import('./specialties/specialties.routes').then(m => m.routes)
    },
    {
        path: 'workers',
        loadChildren: () => import('./workers/workers.routes').then(m => m.routes)
    },
    {
        path: 'subscription',
        loadChildren: () => import('./subscription/subscription.routes').then(m => m.routes)
    },
    {
        path: 'patients',
        loadChildren: () => import('./patients/patients.routes').then(m => m.routes)
    },
    {
        path: 'generals',
        loadChildren: () => import('./generals/generals.routes').then(m => m.routes)
    },
    {
        path: 'offices',
        loadChildren: () => import('./offices/offices.routes').then(m => m.routes)
    },
    {
        path: 'tools',
        loadChildren: () => import('./tools/tools.routes').then(m => m.routes)
    },
    {
        path: 'proformas',
        loadChildren: () => import('./proformas/proformas.routes').then(m => m.routes)
    },
    {
        path: 'biller',
        loadChildren: () => import('./biller/biller.routes').then(m => m.routes)
    },
    {
        path: 'paymentOrders',
        loadChildren: () => import('./payment-orders/payment-orders.routes').then(m => m.routes)
    },
    {
        path: 'payments',
        loadChildren: () => import('./payments/payments.routes').then(m => m.routes)
    },
    {
        path: 'banks',
        loadChildren: () => import('./banks/banks.routes').then(m => m.routes)
    },
    {
        path: 'activities',
        loadChildren: () => import('./activities/activities.routes').then(m => m.routes)
    },
    {
        path: 'paymentMethods',
        loadChildren: () => import('./payment-methods/payment-methods.routes').then(m => m.routes)
    },
    {
        path: 'deliveries',
        loadChildren: () => import('./deliveries/deliveries.routes').then(m => m.routes)
    },
];
