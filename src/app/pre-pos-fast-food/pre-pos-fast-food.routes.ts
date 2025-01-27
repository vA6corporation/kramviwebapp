import { Routes } from "@angular/router";
import { PrePosFastFoodComponent } from "./pre-pos-fast-food/pre-pos-fast-food.component";
import { PreFastFoodComponent } from "./pre-fast-food/pre-fast-food.component";

export const routes: Routes = [
    { path: '', component: PreFastFoodComponent },
    { path: 'prePosFastFood', component: PrePosFastFoodComponent },
];