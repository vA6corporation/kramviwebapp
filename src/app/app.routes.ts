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
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
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
        path: 'favorites',
        loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesModule)
    },

    {
        path: 'posCopy',
        loadChildren: () => import('./pos-copy/pos-copy.module').then(m => m.PosCopyModule)
    },
    {
        path: 'posFastFood',
        loadChildren: () => import('./pos-fast-food/pos-fast-food.module').then(m => m.PosFastFoodModule)
    },
    {
        path: 'credits',
        loadChildren: () => import('./credits/credits.routes').then(m => m.routes)
    },
    {
        path: 'promotions',
        loadChildren: () => import('./promotions/promotions.module').then(m => m.PromotionsModule)
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
        loadChildren: () => import('./incidents/incidents.module').then(m => m.IncidentsModule)
    },
    {
        path: 'incidentSupplies',
        loadChildren: () => import('./incident-supplies/incident-supplies.module').then(m => m.IncidentSuppliesModule)
    },
    {
        path: 'moves',
        loadChildren: () => import('./moves/moves.module').then(m => m.MovesModule)
    },
    {
        path: 'customers',
        loadChildren: () => import('./customers/customers.routes').then(m => m.routes)
    },
    {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
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
        loadChildren: () => import('./carriers/carriers.module').then(m => m.CarriersModule)
    },
    {
        path: 'creditNotes',
        loadChildren: () => import('./credit-notes/credit-notes.routes').then(m => m.routes)
    },
    {
        path: 'remissionGuides',
        loadChildren: () => import('./remission-guides/remission-guides.module').then(m => m.RemissionGuidesModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes').then(m => m.routes)
    },
    {
        path: 'expenses',
        loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule)
    },
    {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
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
        loadChildren: () => import('./purchase-supplies/purchase-supplies.module').then(m => m.PurchaseSuppliesModule)
    },
    {
        path: 'providers',
        loadChildren: () => import('./providers/providers.routes').then(m => m.routes)
    },
    {
        path: 'printers',
        loadChildren: () => import('./printers/printers.module').then(m => m.PrintersModule)
    },
    {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
    },
    {
        path: 'specialties',
        loadChildren: () => import('./specialties/specialties.module').then(m => m.SpecialtiesModule)
    },
    {
        path: 'workers',
        loadChildren: () => import('./workers/workers.routes').then(m => m.routes)
    },
    {
        path: 'subscription',
        loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule)
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
        loadChildren: () => import('./offices/offices.module').then(m => m.OfficesModule)
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
        loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule)
    },
    {
        path: 'paymentMethods',
        loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsModule)
    },
    {
        path: 'deliveries',
        loadChildren: () => import('./deliveries/deliveries.module').then(m => m.DeliveriesModule)
    },
];
