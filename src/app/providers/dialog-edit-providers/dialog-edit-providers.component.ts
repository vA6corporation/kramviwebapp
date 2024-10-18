import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { ProviderModel } from '../../providers/provider.model';
import { ProvidersService } from '../../providers/providers.service';

@Component({
    selector: 'app-dialog-edit-providers',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-providers.component.html',
    styleUrls: ['./dialog-edit-providers.component.sass']
})
export class DialogEditProvidersComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly provider: ProviderModel,
        private readonly formBuilder: FormBuilder,
        private readonly providersService: ProvidersService,
        private readonly dialogRef: MatDialogRef<DialogEditProvidersComponent>,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: 'DNI',
        document: '',
        name: ['', Validators.required],
        address: '',
        mobileNumber: '',
        email: ['', Validators.email],
    })
    maxlength: number = 11
    isLoading: boolean = false

    ngOnInit() {
        this.formGroup.patchValue(this.provider)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.providersService.update(this.formGroup.value, this.provider._id).subscribe({
                next: () => {
                    this.isLoading = false
                    this.dialogRef.close(this.formGroup.value)
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    console.log(error)
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }
}
