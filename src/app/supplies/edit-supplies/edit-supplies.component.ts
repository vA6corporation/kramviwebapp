import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductsService, UnitCodeModel } from '../../products/products.service';
import { SuppliesService } from '../supplies.service';
import { DialogCreateCategorySuppliesComponent } from '../dialog-create-category-supplies/dialog-create-category-supplies.component';
import { CategorySupplyModel } from '../category-supply.model';
import { CategorySuppliesService } from '../category-supplies.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-supplies',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './edit-supplies.component.html',
    styleUrls: ['./edit-supplies.component.sass']
})
export class EditSuppliesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly suppliesService: SuppliesService,
        private readonly categorySuppliesService: CategorySuppliesService,
        private readonly activatedRoute: ActivatedRoute,
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
    private supplyId: string = ''

    private handleCategorySupplies$: Subscription = new Subscription()
    private handleSaveCategorySupply$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCategorySupplies$.unsubscribe()
        this.handleSaveCategorySupply$.unsubscribe()
    }

    async ngOnInit(): Promise<void> {
        this.navigationService.setTitle('Editar Insumo')

        this.handleCategorySupplies$ = this.categorySuppliesService.handleCategorySupplies().subscribe(categorySupplies => {
            this.categorySupplies = categorySupplies
        })

        this.unitCodes = this.productsService.getUnitCodes()
        this.supplyId = this.activatedRoute.snapshot.params['supplyId']
        this.suppliesService.getSupplyById(this.supplyId).subscribe(supply => {
            this.formGroup.patchValue(supply)
        })
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
            this.suppliesService.update(this.formGroup.value, this.supplyId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.suppliesService.loadSupplies()
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
