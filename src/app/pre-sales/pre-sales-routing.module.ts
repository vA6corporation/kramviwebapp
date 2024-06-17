import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePreSalesComponent } from './create-pre-sales/create-pre-sales.component';
import { PosPreSalesEditComponent } from './pos-pre-sales-edit/pos-pre-sales-edit.component';
import { PosPreSalesComponent } from './pos-pre-sales/pos-pre-sales.component';
import { PreSalesComponent } from './pre-sales/pre-sales.component';
import { ChargePreSalesComponent } from '../sales/charge-pre-sales/charge-pre-sales.component';
import { EditPreSalesComponent } from './edit-pre-sales/edit-pre-sales.component';

const routes: Routes = [
    { path: '', component: PreSalesComponent },
    { path: 'create', component: CreatePreSalesComponent },
    { path: 'charge', component: ChargePreSalesComponent },
    { path: 'edit', component: EditPreSalesComponent },
    { path: 'posPreSaleEdit', component: PosPreSalesEditComponent },
    { path: 'posPreSale', component: PosPreSalesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreSalesRoutingModule { }
