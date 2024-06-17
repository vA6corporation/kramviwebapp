import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillerRoutingModule } from './biller-routing.module';
import { CreateBillerComponent } from './create-biller/create-biller.component';
import { EditBillerComponent } from './edit-biller/edit-biller.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogAddProductComponent } from './dialog-add-product/dialog-add-product.component';
import { DialogEditProductComponent } from './dialog-edit-product/dialog-edit-product.component';
import { BillerItemsComponent } from './biller-items/biller-items.component';
import { IndexBillerComponent } from './index-biller/index-biller.component';
import { CreateCreditBillerComponent } from './create-credit-biller/create-credit-biller.component';


@NgModule({
  declarations: [
    CreateBillerComponent,
    EditBillerComponent,
    DialogAddProductComponent,
    DialogEditProductComponent,
    BillerItemsComponent,
    IndexBillerComponent,
    CreateCreditBillerComponent
  ],
  imports: [
    CommonModule,
    BillerRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class BillerModule { }
