import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFavoritesComponent } from './create-favorites/create-favorites.component';

const routes: Routes = [
    { path: 'create', component: CreateFavoritesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FavoritesRoutingModule { }
