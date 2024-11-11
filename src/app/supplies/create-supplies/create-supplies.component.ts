import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductsService, UnitCodeModel } from '../../products/products.service';
import { SuppliesService } from '../supplies.service';
import { DialogCreateCategorySuppliesComponent } from '../dialog-create-category-supplies/dialog-create-category-supplies.component';
import { CategorySuppliesService } from '../category-supplies.service';
import { CategorySupplyModel } from '../category-supply.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-supplies',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './create-supplies.component.html',
    styleUrls: ['./create-supplies.component.sass']
})
export class CreateSuppliesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly suppliesService: SuppliesService,
        private readonly categorySuppliesService: CategorySuppliesService,
        private readonly router: Router,
        private readonly matDialog: MatDialog
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        feature: '',
        brand: '',
        categorySupplyId: [null, Validators.required],
        unitCode: 'NIU',
        cost: ['', Validators.required],
    })
    isLoading: boolean = false
    unitCodes: UnitCodeModel[] = []
    categorySupplies: CategorySupplyModel[] = []

    private handleCategorySupplies$: Subscription = new Subscription()
    private handleSaveCategorySupply$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCategorySupplies$.unsubscribe()
        this.handleSaveCategorySupply$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo Insumo')
        this.handleCategorySupplies$ = this.categorySuppliesService.handleCategorySupplies().subscribe(categorySupplies => {
            this.categorySupplies = categorySupplies
        })
        this.unitCodes = this.productsService.getUnitCodes()
    }

    onAddCategory() {
        const dialogRef = this.matDialog.open(DialogCreateCategorySuppliesComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        this.handleSaveCategorySupply$ = dialogRef.componentInstance.handleSaveCategorySupply().subscribe(categorySupply => {
            this.formGroup.get('categorySupplyId')?.patchValue(categorySupply._id)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.suppliesService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.suppliesService.loadSupplies()
                    this.navigationService.showMessage('Registrado correctamente')
                    this.router.navigate(['/supplies'])
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
