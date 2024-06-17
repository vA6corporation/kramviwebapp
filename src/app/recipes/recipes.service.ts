import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpService } from '../http.service';
import { SupplyModel } from '../supplies/supply.model';
import { RecipeModel } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  private recipes: RecipeModel[] = [];
  private recipes$ = new BehaviorSubject<RecipeModel[]>([]);

  addRecipeItem(supply: SupplyModel) {
    const foundIndex = this.recipes.findIndex(e => e.supplyId === supply._id);
    if (foundIndex >= 0) {
      this.recipes[foundIndex].quantity += 1;
    } else {
      const recipe: RecipeModel = {
        name: supply.name,
        cost: supply.cost,
        quantity: 1,
        supplyId: supply._id,
      }
      this.recipes.push(recipe);
    }
    this.recipes$.next(this.recipes);
  }

  getRecipe(index: number): RecipeModel {
    return this.recipes[index];
  }

  setRecipes(recipes: RecipeModel[]) {
    this.recipes = recipes;
    this.recipes$.next(this.recipes);
  } 

  handleRecipes(): Observable<RecipeModel[]> {
    return this.recipes$.asObservable();
  }

  updateRecipe(index: number, supplyItem: RecipeModel) {
    this.recipes.splice(index, 1, supplyItem);
    this.recipes$.next(this.recipes);
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipes$.next(this.recipes);
  }

  saveRecipe(recipes: RecipeModel[], productId: string) {
    return this.httpService.post(`recipes/${productId}`, { recipes });
  }

  saveSubRecipe(recipes: RecipeModel[], productId: string) {
    return this.httpService.post(`recipes/${productId}`, { recipes });
  }

  getRecipesByProduct(productId: string): Observable<RecipeModel[]> {
    return this.httpService.get(`recipes/byProduct/${productId}`);
  }
  
}
