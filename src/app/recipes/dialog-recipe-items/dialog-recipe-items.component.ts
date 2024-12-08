import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecipeModel } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { MaterialModule } from '../../material.module';

@Component({
    imports: [MaterialModule, ReactiveFormsModule],
    selector: 'app-dialog-recipe-items',
    templateUrl: './dialog-recipe-items.component.html',
    styleUrls: ['./dialog-recipe-items.component.sass'],
})
export class DialogRecipeItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly recipesService: RecipesService,
        private readonly dialogRef: MatDialogRef<DialogRecipeItemsComponent>,
    ) { }

    recipe: RecipeModel = this.recipesService.getRecipe(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.recipe.quantity, Validators.required],
        cost: [this.recipe.cost, Validators.required],
    })

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, cost } = this.formGroup.value
            this.recipe.quantity = quantity
            this.recipe.cost = cost
            this.recipesService.updateRecipe(this.index, this.recipe)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.recipesService.removeRecipe(this.index)
    }

}
