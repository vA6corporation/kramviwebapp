import { Routes } from '@angular/router';
import { CreditsComponent } from './credits/credits.component';
import { DetailCreditsComponent } from './detail-credits/detail-credits.component';

export const routes: Routes = [
    { path: '', component: CreditsComponent },
    { path: ':creditId/details', component: DetailCreditsComponent }
];