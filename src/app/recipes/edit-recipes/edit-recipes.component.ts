import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductsService } from '../../products/products.service';
import { SalesService } from '../../sales/sales.service';
import { DialogRecipeItemsComponent } from '../dialog-recipe-items/dialog-recipe-items.component';
import { RecipesService } from '../recipes.service';
import { RecipeModel } from '../recipe.model';
import { SupplyModel } from '../../supplies/supply.model';
import { SuppliesService } from '../../supplies/supplies.service';
import { CategorySuppliesService } from '../../supplies/category-supplies.service';
import { CategorySupplyModel } from '../../supplies/category-supply.model';

@Component({
    selector: 'app-edit-recipes',
    templateUrl: './edit-recipes.component.html',
    styleUrls: ['./edit-recipes.component.sass']
})
export class EditRecipesComponent {

    constructor(
        private readonly recipesService: RecipesService,
        private readonly categorySuppliesService: CategorySuppliesService,
        private readonly suppliesService: SuppliesService,
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly salesService: SalesService,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    categorySupplies: CategorySupplyModel[] = []
    filterSupplies: SupplyModel[] = []
    supplies: SupplyModel[] = []
    recipes: RecipeModel[] = []
    selectedIndex: number = 0
    charge: number = 0
    private productId: string = ''

    private handleRecipes$: Subscription = new Subscription()
    private handleSupplies$: Subscription = new Subscription()
    private handleCategorySupplies$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleRecipes$.unsubscribe()
        this.handleSupplies$.unsubscribe()
        this.handleCategorySupplies$.unsubscribe()
    }

    ngOnInit(): void {
        this.productId = this.activatedRoute.snapshot.params['productId']
        this.productsService.getProductById(this.productId).subscribe(product => {
            this.navigationService.setTitle(`Editar Receta ${product.fullName}`)
        })

        this.recipesService.getRecipesByProduct(this.productId).subscribe(recipeItems => {
            this.recipesService.setRecipes(recipeItems)
        })

        this.handleCategorySupplies$ = this.categorySuppliesService.handleCategorySupplies().subscribe(categorySupplies => {
            this.categorySupplies = categorySupplies
        })

        this.handleSupplies$ = this.suppliesService.handleSupplies().subscribe(supplies => {
            this.supplies = supplies
        })

        this.handleRecipes$ = this.recipesService.handleRecipes().subscribe(recipes => {
            this.recipes = recipes
            this.charge = recipes.map(e => e.cost * e.quantity).reduce((a, b) => a + b, 0)
        })
    }

    onClickRecipe(index: number) {
        this.matDialog.open(DialogRecipeItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

    onClickSupply(supply: SupplyModel) {
        this.recipesService.addRecipeItem(supply)
    }

    onSelectCategorySupply(categorySupplyId: string) {
        this.selectedIndex = 1
        this.filterSupplies = this.supplies.filter(e => e.categorySupplyId === categorySupplyId)
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.salesService.setSaleItems([])
        }
    }

    onSubmit() {
        this.navigationService.loadBarStart()
        this.recipesService.saveRecipe(this.recipes, this.productId).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage('Se han guardado los cambios')
        })
    }

}
