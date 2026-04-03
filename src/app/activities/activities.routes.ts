import { Routes } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { CreateActivitiesComponent } from './create-activities/create-activities.component';
import { EditActivitiesComponent } from './edit-activities/edit-activities.component';

export const routes: Routes = [
    { path: '', component: ActivitiesComponent },
    { path: 'create', component: CreateActivitiesComponent },
    { path: ':activityId/edit', component: EditActivitiesComponent }
];