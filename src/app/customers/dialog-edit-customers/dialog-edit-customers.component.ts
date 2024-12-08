import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerForm } from '../customer.form';
import { CustomerModel } from '../customer.model';
import { CustomersService } from '../customers.service';
import { DocumentType } from '../document-type.enum';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
    selector: 'app-dialog-edit-customers',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-customers.component.html',
    styleUrls: ['./dialog-edit-customers.component.sass']
})
export class DialogEditCustomersComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly customer: CustomerModel,
        private readonly customersService: CustomersService,
        private readonly dialogRef: MatDialogRef<DialogEditCustomersComponent>,
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
        creditLimit: new FormControl(null)
    })
    isLoading: boolean = false
    maxLength: number = 11
    private customerId: string = this.customer._id

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
        this.formGroup.patchValue(this.customer)
        for (const address of this.customer.addresses) {
            this.formArray.push(new FormControl(address, { nonNullable: true, validators: Validators.required }))
        }
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
            const customer = this.formGroup.value
            this.customersService.update(customer, this.customerId).subscribe({
                next: () => {
                    this.isLoading = false
                    Object.assign(this.customer, customer)
                    this.dialogRef.close(this.customer)
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
