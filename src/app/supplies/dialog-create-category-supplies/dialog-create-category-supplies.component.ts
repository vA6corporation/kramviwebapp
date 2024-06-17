import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { CategorySuppliesService } from '../category-supplies.service';
import { CategorySupplyModel } from '../category-supply.model';

@Component({
    selector: 'app-dialog-create-category-supplies',
    templateUrl: './dialog-create-category-supplies.component.html',
    styleUrls: ['./dialog-create-category-supplies.component.sass']
})
export class DialogCreateCategorySuppliesComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly categorySuppliesService: CategorySuppliesService,
        private readonly dialogRef: MatDialogRef<DialogCreateCategorySuppliesComponent>,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required]
    });

    private onSave$: Subject<CategorySupplyModel> = new Subject()
    isLoading: boolean = false

    ngOnInit(): void {
    }

    handleSaveCategorySupply(): Observable<CategorySupplyModel> {
        return this.onSave$.asObservable()
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.disableClose = true
            this.isLoading = true
            this.navigationService.loadBarStart()
            const { name } = this.formGroup.value
            this.categorySuppliesService.create(name).subscribe({
                next: categorySupply => {
                    this.dialogRef.close()
                    this.onSave$.next(categorySupply)
                    this.categorySuppliesService.loadCategorySupplies()
                    this.navigationService.loadBarFinish()
                }, error: (error: HttpErrorResponse) => {
                    this.dialogRef.disableClose = false
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
