import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkersRoutingModule } from './workers-routing.module';
import { EditWorkersComponent } from './edit-workers/edit-workers.component';
import { WorkersComponent } from './workers/workers.component';
import { CreateWorkersComponent } from './create-workers/create-workers.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditWorkersComponent,
    WorkersComponent,
    CreateWorkersComponent,
  ],
  imports: [
    CommonModule,
    WorkersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class WorkersModule { }
