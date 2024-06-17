import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditsComponent } from './credits/credits.component';
import { DetailCreditsComponent } from './detail-credits/detail-credits.component';

const routes: Routes = [
  { path: '', component: CreditsComponent },
  { path: ':creditId/details', component: DetailCreditsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditsRoutingModule { }
