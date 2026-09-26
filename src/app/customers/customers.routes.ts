import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { CreateCustomersComponent } from './create-customers/create-customers.component';
import { EditCustomersComponent } from './edit-customers/edit-customers.component';
import { SaleCustomersComponent } from './sale-customers/sale-customers.component';
import { CreditCustomersComponent } from './credit-customers/credit-customers.component';

export const routes: Routes = [
    { path: '', component: CustomersComponent },
    { path: 'create', component: CreateCustomersComponent },
    { path: ':customerId/edit', component: EditCustomersComponent },
    { path: ':customerId/sales', component: SaleCustomersComponent },
    { path: ':customerId/credits', component: CreditCustomersComponent }
];