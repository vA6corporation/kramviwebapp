import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomersComponent } from './customers/customers.component';
import { CreateCustomersComponent } from './create-customers/create-customers.component';
import { EditCustomersComponent } from './edit-customers/edit-customers.component';
import { DialogCustomerDetailsComponent } from './dialog-customer-details/dialog-customer-details.component';
import { SaleCustomersComponent } from './sale-customers/sale-customers.component';
import { CreditCustomersComponent } from './credit-customers/credit-customers.component';
import { DeletedCustomersComponent } from './deleted-customers/deleted-customers.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    CustomersComponent,
    CreateCustomersComponent,
    EditCustomersComponent,
    DialogCustomerDetailsComponent,
    SaleCustomersComponent,
    CreditCustomersComponent,
    DeletedCustomersComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    CustomersRoutingModule,
    ReactiveFormsModule,
  ],
})
export class CustomersModule { }
