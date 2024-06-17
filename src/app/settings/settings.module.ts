import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogPriceListsComponent } from './dialog-price-lists/dialog-price-lists.component';
import { DialogEditPriceListsComponent } from './dialog-edit-price-lists/dialog-edit-price-lists.component';
// import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SettingsComponent,
    DialogPriceListsComponent,
    DialogEditPriceListsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
    // FormsModule,
  ]
})
export class SettingsModule { }
