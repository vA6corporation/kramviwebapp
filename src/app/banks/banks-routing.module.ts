import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanksComponent } from './banks/banks.component';
import { CreateBanksComponent } from './create-banks/create-banks.component';
import { EditBanksComponent } from './edit-banks/edit-banks.component';

const routes: Routes = [
  { path: '', component: BanksComponent },
  { path: 'create', component: CreateBanksComponent },
  { path: ':bankId/edit', component: EditBanksComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanksRoutingModule { }
