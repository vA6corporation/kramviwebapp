import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { TablesComponent } from './tables/tables.component';
import { CreateTablesComponent } from './create-tables/create-tables.component';
import { EditTablesComponent } from './edit-tables/edit-tables.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TablesComponent,
    CreateTablesComponent,
    EditTablesComponent
  ],
  imports: [
    CommonModule,
    TablesRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TablesModule { }
