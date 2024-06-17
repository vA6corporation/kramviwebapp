import { Routes } from '@angular/router';
import { ChargeEditProformasComponent } from './charge-edit-proformas/charge-edit-proformas.component';
import { ChargeProformasComponent } from './charge-proformas/charge-proformas.component';
import { CopyProformasComponent } from './copy-proformas/copy-proformas.component';
import { CreateProformasComponent } from './create-proformas/create-proformas.component';
import { EditProformasComponent } from './edit-proformas/edit-proformas.component';
import { ProformasComponent } from './proformas/proformas.component';

export const routes: Routes = [
  { path: '', component: ProformasComponent },
  { path: 'create', component: CreateProformasComponent },
  { path: ':proformaId/edit', component: EditProformasComponent },
  { path: 'charge', component: ChargeProformasComponent },
  { path: 'chargeEdit', component: ChargeEditProformasComponent },
  { path: 'copy', component: CopyProformasComponent }
];
