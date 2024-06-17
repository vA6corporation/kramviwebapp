import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTablesComponent } from './create-tables/create-tables.component';
import { EditTablesComponent } from './edit-tables/edit-tables.component';
import { TablesComponent } from './tables/tables.component';

const routes: Routes = [
  { path: '', component: TablesComponent },
  { path: 'create', component: CreateTablesComponent },
  { path: ':tableId/edit', component: EditTablesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesRoutingModule { }
