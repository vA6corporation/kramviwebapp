import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { ProvidersService } from '../../providers/providers.service';

@Component({
    selector: 'app-dialog-create-providers',
    templateUrl: './dialog-create-providers.component.html',
    styleUrls: ['./dialog-create-providers.component.sass']
})
export class DialogCreateProvidersComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly providersService: ProvidersService,
        private readonly dialogRef: MatDialogRef<DialogCreateCustomersComponent>,
        private readonly navigationService: NavigationService,
    ) { }

    formArray: FormArray = this.formBuilder.array([])
    formGroup: FormGroup = this.formBuilder.group({
        documentType: 'RUC',
        document: null,
        name: [null, Validators.required],
        address: null,
        mobileNumber: null,
        email: [null, Validators.email],
        banks: this.formArray,
    })
    documentTypes: string[] = ['RUC', 'DNI', 'CE']
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

    onAddAccount() {
        const formGroup = this.formBuilder.group({
            bankName: 'BCP',
            accountNumber: [null, Validators.required],
        })
        this.formArray.push(formGroup)
    }

    onRemoveAccount(index: number) {
        this.formArray.removeAt(index)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.providersService.create(this.formGroup.value, this.formArray.value).subscribe(provider => {
                this.isLoading = false
                this.dialogRef.close(provider)
                this.navigationService.showMessage('Registrado correctamente')
            }, (error: HttpErrorResponse) => {
                this.isLoading = false
                console.log(error)
                this.navigationService.showMessage(error.error.message)
            })
        }
    }

}
