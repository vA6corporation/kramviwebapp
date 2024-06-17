import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes/recipes.component';
import { MaterialModule } from '../material.module';
import { EditRecipesComponent } from './edit-recipes/edit-recipes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogRecipeItemsComponent } from './dialog-recipe-items/dialog-recipe-items.component';
import { CreateRecipesComponent } from './create-recipes/create-recipes.component';


@NgModule({
  declarations: [
    RecipesComponent,
    EditRecipesComponent,
    DialogRecipeItemsComponent,
    CreateRecipesComponent,
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class RecipesModule { }
