import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProvidersComponent } from './create-providers/create-providers.component';
import { CreditProvidersComponent } from './credit-providers/credit-providers.component';
import { EditProvidersComponent } from './edit-providers/edit-providers.component';
import { ProvidersComponent } from './providers/providers.component';

const routes: Routes = [
  { path: '', component: ProvidersComponent },
  { path: 'create', component: CreateProvidersComponent },
  { path: ':providerId/edit', component: EditProvidersComponent },
  { path: ':providerId/credits', component: CreditProvidersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
