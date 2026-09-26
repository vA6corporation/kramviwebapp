import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUsersComponent } from './create-users/create-users.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { IndexUsersComponent } from './index-users/index-users.component';
import { PrivilegesComponent } from './privileges/privileges.component';

const routes: Routes = [
  { path: '', component: IndexUsersComponent },
  { path: 'create', component: CreateUsersComponent },
  { path: ':userId/edit', component: EditUsersComponent },
  { path: ':userId/privileges', component: PrivilegesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
