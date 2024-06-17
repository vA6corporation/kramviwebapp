import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWorkersComponent } from './create-workers/create-workers.component';
import { EditWorkersComponent } from './edit-workers/edit-workers.component';
import { WorkersComponent } from './workers/workers.component';

const routes: Routes = [
  { path: '', component: WorkersComponent },
  { path: 'create', component: CreateWorkersComponent },
  { path: ':workerId/edit', component: EditWorkersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkersRoutingModule { }
