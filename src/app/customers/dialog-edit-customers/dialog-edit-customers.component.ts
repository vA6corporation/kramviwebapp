import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CustomerForm } from '../customer.form'
import { CustomerModel } from '../customer.model'
import { CustomersService } from '../customers.service'
import { DocumentType } from '../document-type.enum'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'

@Component({
    selector: 'app-dialog-edit-customers',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-customers.component.html',
    styleUrls: ['./dialog-edit-customers.component.sass']
})
export class DialogEditCustomersComponent {

    private readonly customer: CustomerModel = inject(MAT_DIALOG_DATA)
    private readonly dialogRef: MatDialogRef<DialogEditCustomersComponent> = inject(MatDialogRef)
    private readonly customersService = inject(CustomersService)
    private readonly navigationService = inject(NavigationService)

    formGroup = new FormGroup<CustomerForm>({
        document: new FormControl('', { nonNullable: true }),
        documentType: new FormControl(DocumentType.DNI, { nonNullable: true }),
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        address: new FormControl('', { nonNullable: true }),
        phone: new FormControl('', { nonNullable: true }),
        email: new FormControl('', { nonNullable: true, validators: Validators.email }),
        observation: new FormControl('', { nonNullable: true }),
    })
    $isLoading = signal<boolean>(false)
    maxLength: number = 11
    private customerId: any = this.customer.id

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
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            const customer = JSON.parse(JSON.stringify(this.formGroup.value))
            this.customersService.update(customer, this.customerId).subscribe({
                next: customer => {
                    this.$isLoading.set(false)
                    this.dialogRef.close(customer)
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
