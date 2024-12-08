import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { ProvidersService } from '../../providers/providers.service';

@Component({
    selector: 'app-dialog-create-providers',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-providers.component.html',
    styleUrls: ['./dialog-create-providers.component.sass']
})
export class DialogCreateProvidersComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly providersService: ProvidersService,
        private readonly dialogRef: MatDialogRef<DialogCreateCustomersComponent>,
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
    isLoading: boolean = false
    maxLength: number = 11

    ngOnInit(): void {
        this.formGroup.get('documentType')?.valueChanges.subscribe(value => {
            switch (value) {
                case 'RUC':
                    this.formGroup.get('document')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)])
                    this.maxLength = 11
                    break
                case 'DNI':
                    this.formGroup.get('document')?.setValidators([Validators.minLength(8), Validators.maxLength(8)])
                    this.maxLength = 8
                    break
                case 'CE':
                    this.formGroup.get('document')?.setValidators([Validators.minLength(9), Validators.maxLength(9)])
                    this.maxLength = 9
                    break
            }
            this.formGroup.get('document')?.updateValueAndValidity()
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.providersService.create(this.formGroup.value).subscribe({
                next: provider => {
                    this.isLoading = false
                    this.dialogRef.close(provider)
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
