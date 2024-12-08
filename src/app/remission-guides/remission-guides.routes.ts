import { Routes } from '@angular/router';
import { ChargeEditRemissionGuidesComponent } from './charge-edit-remission-guides/charge-edit-remission-guides.component';
import { ChargeRemissionGuidesComponent } from './charge-remission-guides/charge-remission-guides.component';
import { CreateRemissionGuidesComponent } from './create-remission-guides/create-remission-guides.component';
import { EditRemissionGuidesComponent } from './edit-remission-guides/edit-remission-guides.component';
import { RemissionGuidesComponent } from './remission-guides/remission-guides.component';

export const routes: Routes = [
    { path: '', component: RemissionGuidesComponent },
    { path: 'create', component: CreateRemissionGuidesComponent },
    { path: 'charge', component: ChargeRemissionGuidesComponent },
    { path: ':remissionGuideId/edit', component: EditRemissionGuidesComponent },
    { path: 'chargeEdit', component: ChargeEditRemissionGuidesComponent },
];
