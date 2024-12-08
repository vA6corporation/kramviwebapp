import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriesService } from '../categories.service';
import { CategoryModel } from '../category.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
    selector: 'app-dialog-edit-categories',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-categories.component.html',
    styleUrls: ['./dialog-edit-categories.component.sass']
})
export class DialogEditCategoriesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly category: CategoryModel,
        private readonly formBuilder: FormBuilder,
        private readonly categoriesService: CategoriesService,
        private readonly dialogRef: MatDialogRef<DialogEditCategoriesComponent>,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        deletedAt: null,
    })
    isLoading: boolean = false

    ngOnInit(): void {
        this.formGroup.patchValue(this.category)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.categoriesService.update(this.formGroup.value, this.category._id).subscribe(() => {
                this.dialogRef.close(true)
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Se han guardado los cambios')
            }, (error: HttpErrorResponse) => {
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        }
    }
}
