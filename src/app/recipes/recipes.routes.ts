import { Routes } from '@angular/router';
import { CreateRecipesComponent } from './create-recipes/create-recipes.component';
import { EditRecipesComponent } from './edit-recipes/edit-recipes.component';
import { RecipesComponent } from './recipes/recipes.component';

export const routes: Routes = [
    { path: '', component: RecipesComponent },
    { path: 'create', component: CreateRecipesComponent },
    { path: ':productId/edit', component: EditRecipesComponent },
];