import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../customers.service';
import { CustomerForm } from '../customer.form';
import { DocumentType } from '../document-type.enum';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
    selector: 'app-dialog-create-customers',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-customers.component.html',
    styleUrls: ['./dialog-create-customers.component.sass']
})
export class DialogCreateCustomersComponent {

    constructor(
        private readonly customersService: CustomersService,
        private readonly dialogRef: MatDialogRef<DialogCreateCustomersComponent>,
        private readonly navigationService: NavigationService,
    ) { }

    formArray: FormArray = new FormArray<FormControl<string>>([])
    formGroup = new FormGroup<CustomerForm>({
        document: new FormControl('', { nonNullable: true }),
        documentType: new FormControl(DocumentType.DNI, { nonNullable: true }),
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        addresses: this.formArray,
        mobileNumber: new FormControl('', { nonNullable: true }),
        email: new FormControl('', { nonNullable: true, validators: Validators.email }),
        birthDate: new FormControl('', { nonNullable: true }),
        observations: new FormControl('', { nonNullable: true }),
    })
    isLoading: boolean = false
    maxLength: number = 8

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

    onAddAddress() {
        const formControl = new FormControl('', { nonNullable: true, validators: Validators.required })
        this.formArray.push(formControl)
    }

    onRemoveAddress(index: number) {
        this.formArray.removeAt(index)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.customersService.create(this.formGroup.value).subscribe({
                next: customer => {
                    this.isLoading = false
                    this.dialogRef.close(customer)
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }
}
