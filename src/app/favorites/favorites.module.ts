import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesRoutingModule } from './favorites-routing.module';
import { CreateFavoritesComponent } from './create-favorites/create-favorites.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FavoritesComponent } from './favorites/favorites.component';
import { FavoriteItemsComponent } from './favorite-items/favorite-items.component';


@NgModule({
  declarations: [
    CreateFavoritesComponent,
    FavoritesComponent,
    FavoriteItemsComponent
  ],
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [FavoritesComponent]
})
export class FavoritesModule { }
