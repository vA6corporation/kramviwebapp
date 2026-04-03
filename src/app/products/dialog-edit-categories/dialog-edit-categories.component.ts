import { HttpErrorResponse } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CategoriesService } from '../categories.service'
import { CategoryModel } from '../category.model'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'

@Component({
    selector: 'app-dialog-edit-categories',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-categories.component.html',
    styleUrls: ['./dialog-edit-categories.component.sass']
})
export class DialogEditCategoriesComponent {

    private readonly category: CategoryModel = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly dialogRef: MatDialogRef<DialogEditCategoriesComponent> = inject(MatDialogRef)
    private readonly categoriesService = inject(CategoriesService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        color: '',
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
            this.categoriesService.update(this.formGroup.value, this.category.id).subscribe(() => {
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
