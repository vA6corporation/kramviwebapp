import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarriersRoutingModule } from './carriers-routing.module';
import { CarriersComponent } from './carriers/carriers.component';
import { CreateCarriersComponent } from './create-carriers/create-carriers.component';
import { EditCarriersComponent } from './edit-carriers/edit-carriers.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogCarriersComponent } from './dialog-carriers/dialog-carriers.component';
import { DialogCreateCarriersComponent } from './dialog-create-carriers/dialog-create-carriers.component';
import { DialogEditCarriersComponent } from './dialog-edit-carriers/dialog-edit-carriers.component';


@NgModule({
  declarations: [
    CarriersComponent,
    CreateCarriersComponent,
    EditCarriersComponent,
    DialogCarriersComponent,
    DialogCreateCarriersComponent,
    DialogEditCarriersComponent
  ],
  imports: [
    CommonModule,
    CarriersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class CarriersModule { }
