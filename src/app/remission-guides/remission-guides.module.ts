import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemissionGuidesRoutingModule } from './remission-guides-routing.module';
import { RemissionGuidesComponent } from './remission-guides/remission-guides.component';
import { CreateRemissionGuidesComponent } from './create-remission-guides/create-remission-guides.component';
import { EditRemissionGuidesComponent } from './edit-remission-guides/edit-remission-guides.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogRemissionGuidesComponent } from './dialog-remission-guides/dialog-remission-guides.component';
import { RemissionGuideItemsComponent } from './remission-guide-items/remission-guide-items.component';
import { DialogRemissionGuideItemsComponent } from './dialog-remission-guide-items/dialog-remission-guide-items.component';
import { ChargeRemissionGuidesComponent } from './charge-remission-guides/charge-remission-guides.component';
import { ChargeEditRemissionGuidesComponent } from './charge-edit-remission-guides/charge-edit-remission-guides.component';
import { DialogDetailRemissionGuidesComponent } from './dialog-detail-remission-guides/dialog-detail-remission-guides.component';


@NgModule({
  declarations: [
    RemissionGuidesComponent,
    CreateRemissionGuidesComponent,
    EditRemissionGuidesComponent,
    DialogRemissionGuidesComponent,
    RemissionGuideItemsComponent,
    DialogRemissionGuideItemsComponent,
    ChargeRemissionGuidesComponent,
    ChargeEditRemissionGuidesComponent,
    DialogDetailRemissionGuidesComponent,
  ],
  imports: [
    CommonModule,
    RemissionGuidesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    RemissionGuidesComponent,
  ]
})
export class RemissionGuidesModule { }
