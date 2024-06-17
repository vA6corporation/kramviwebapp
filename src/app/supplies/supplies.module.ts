import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliesRoutingModule } from './supplies-routing.module';
import { SuppliesComponent } from './supplies/supplies.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditSuppliesComponent } from './edit-supplies/edit-supplies.component';
import { CreateSuppliesComponent } from './create-supplies/create-supplies.component';
import { DialogDetailSuppliesComponent } from './dialog-detail-supplies/dialog-detail-supplies.component';
import { DialogCreateCategorySuppliesComponent } from './dialog-create-category-supplies/dialog-create-category-supplies.component';
import { DialogEditCategorySuppliesComponent } from './dialog-edit-category-supplies/dialog-edit-category-supplies.component';
import { CategorySuppliesComponent } from './category-supplies/category-supplies.component';


@NgModule({
  declarations: [
    SuppliesComponent,
    EditSuppliesComponent,
    CreateSuppliesComponent,
    DialogDetailSuppliesComponent,
    DialogCreateCategorySuppliesComponent,
    DialogEditCategorySuppliesComponent,
    CategorySuppliesComponent
  ],
  imports: [
    CommonModule,
    SuppliesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class SuppliesModule { }
