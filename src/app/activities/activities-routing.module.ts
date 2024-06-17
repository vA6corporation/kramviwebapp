import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { CreateActivitiesComponent } from './create-activities/create-activities.component';
import { EditActivitiesComponent } from './edit-activities/edit-activities.component';

const routes: Routes = [
  { path: '', component: ActivitiesComponent },
  { path: 'create', component: CreateActivitiesComponent },
  { path: ':activityId/edit', component: EditActivitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitiesRoutingModule { }
