import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BanksRoutingModule } from './banks-routing.module';
import { BanksComponent } from './banks/banks.component';
import { CreateBanksComponent } from './create-banks/create-banks.component';
import { EditBanksComponent } from './edit-banks/edit-banks.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BanksComponent,
    CreateBanksComponent,
    EditBanksComponent
  ],
  imports: [
    CommonModule,
    BanksRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class BanksModule { }
