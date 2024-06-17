import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotsComponent } from './lots/lots.component';
import { CreateLotsComponent } from './create-lots/create-lots.component';
import { EditLotsComponent } from './edit-lots/edit-lots.component';

const routes: Routes = [
    { path: '', component: LotsComponent },
    { path: 'create', component: CreateLotsComponent },
    { path: ':lotId/edit', component: EditLotsComponent },
] 

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class LotsModule { }
