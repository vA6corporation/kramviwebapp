import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintersRoutingModule } from './printers-routing.module';
import { PrintersComponent } from './printers/printers.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogAddPrintersComponent } from './dialog-add-printers/dialog-add-printers.component';


@NgModule({
  declarations: [
    PrintersComponent,
    DialogAddPrintersComponent
  ],
  imports: [
    CommonModule,
    PrintersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class PrintersModule { }
