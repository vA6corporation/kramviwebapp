import { Routes } from '@angular/router';
import { CreateTablesComponent } from './create-tables/create-tables.component';
import { EditTablesComponent } from './edit-tables/edit-tables.component';
import { TablesComponent } from './tables/tables.component';

export const routes: Routes = [
    { path: '', component: TablesComponent },
    { path: 'create', component: CreateTablesComponent },
    { path: ':tableId/edit', component: EditTablesComponent }
];
