import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductsService } from '../../products/products.service';
import { SalesService } from '../../sales/sales.service';
import { DialogRecipeItemsComponent } from '../dialog-recipe-items/dialog-recipe-items.component';
import { RecipeModel } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
    selector: 'app-create-recipes',
    templateUrl: './create-recipes.component.html',
    styleUrls: ['./create-recipes.component.sass']
})
export class CreateRecipesComponent {

    constructor(
        private readonly recipesService: RecipesService,
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly salesService: SalesService,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    recipes: RecipeModel[] = []
    selectedIndex: number = 0
    charge: number = 0
    private productId: string = ''

    private recipes$: Subscription = new Subscription()
    private subRecipeCategories$: Subscription = new Subscription()
    private subRecipes$: Subscription = new Subscription()

    ngOnDestroy() {
        this.recipes$.unsubscribe()
        this.subRecipeCategories$.unsubscribe()
        this.subRecipes$.unsubscribe()
    }

    ngOnInit(): void {
        this.productId = this.activatedRoute.snapshot.params['productId']

        this.productsService.getProductById(this.productId).subscribe(product => {
            this.navigationService.setTitle(`Editar Receta ${product.fullName}`)
        })

        this.recipesService.getRecipesByProduct(this.productId).subscribe(recipes => {
            this.recipesService.setRecipes(recipes)
        })

        this.recipes$ = this.recipesService.handleRecipes().subscribe(recipes => {
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

    onClickSubRecipeCategory(subRecipeCategoryId: string) {
        this.selectedIndex = 1
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.salesService.setSaleItems([])
        }
    }

    onClickSubRecipe(subRecipe: any): void {
        this.recipesService.addRecipeItem(subRecipe)
    }

    onSubmit() {
        this.navigationService.loadBarStart()
        this.recipesService.saveRecipe(this.recipes, this.productId).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage('Se han guardado los cambios')
        })
    }

}
