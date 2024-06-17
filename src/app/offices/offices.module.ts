import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficesRoutingModule } from './offices-routing.module';
import { OfficesComponent } from './offices/offices.component';
import { EditOfficesComponent } from './edit-offices/edit-offices.component';
import { CreateOfficesComponent } from './create-offices/create-offices.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DisabledOfficesComponent } from './disabled-offices/disabled-offices.component';
import { IndexOfficesComponent } from './index-offices/index-offices.component';


@NgModule({
  declarations: [
    OfficesComponent,
    EditOfficesComponent,
    CreateOfficesComponent,
    DisabledOfficesComponent,
    IndexOfficesComponent
  ],
  imports: [
    CommonModule,
    OfficesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class OfficesModule { }
