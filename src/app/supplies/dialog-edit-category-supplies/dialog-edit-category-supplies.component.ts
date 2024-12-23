import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { CategorySuppliesService } from '../category-supplies.service';
import { CategorySupplyModel } from '../category-supply.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-edit-category-supplies',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-category-supplies.component.html',
    styleUrls: ['./dialog-edit-category-supplies.component.sass']
})
export class DialogEditCategorySuppliesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly categorySupply: CategorySupplyModel,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly categorySuppliesService: CategorySuppliesService,
        private readonly dialogRef: MatDialogRef<DialogEditCategorySuppliesComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        _id: null,
        name: ['', Validators.required]
    })
    isLoading: boolean = false

    ngOnInit(): void {
        this.formGroup.patchValue(this.categorySupply)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const { name, _id } = this.formGroup.value
            this.categorySuppliesService.update(_id, name).subscribe({
                next: () => {
                    this.dialogRef.close(true)
                    this.navigationService.loadBarFinish()
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
