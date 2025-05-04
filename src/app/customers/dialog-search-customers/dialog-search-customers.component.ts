import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CustomerModel } from '../customer.model';
import { CustomersService } from '../customers.service';

@Component({
    selector: 'app-dialog-search-customers',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-search-customers.component.html',
    styleUrl: './dialog-search-customers.component.sass'
})
export class DialogSearchCustomersComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly searchType: string,
        private readonly formBuilder: FormBuilder,
        private readonly customersService: CustomersService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogSearchCustomersComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        searchType: 'NAME',
        key: ['', Validators.required],
    })
    customers: CustomerModel[] = []
    maxlength: number = 11
    searchTypes = [
        { code: 'RUC', label: 'RUC' },
        { code: 'DNI', label: 'DNI' },
        { code: 'CE', label: 'CE' },
        { code: 'MOBILE', label: 'CELULAR' },
        { code: 'NAME', label: 'NOMBRES' },
    ]
    isLoading: boolean = false

    private createCustomer: EventEmitter<void> = new EventEmitter()

    ngOnInit(): void {
        this.formGroup.get('searchType')?.valueChanges.subscribe(value => {
            switch (value) {
                case 'RUC':
                    this.formGroup.get('key')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)])
                    this.maxlength = 11
                    break
                case 'DNI':
                    this.formGroup.get('key')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)])
                    this.maxlength = 8
                    break
                case 'CE':
                    this.formGroup.get('key')?.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)])
                    this.maxlength = 9
                    break
                case 'MOBILE':
                    this.formGroup.get('key')?.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)])
                    this.maxlength = 9
                    break
                default:
                    this.formGroup.get('key')?.setValidators([Validators.required])
                    this.maxlength = 50
            }
            this.formGroup.get('key')?.updateValueAndValidity()
        })

        this.formGroup.get('searchType')?.patchValue(this.searchType || 'RUC')

    }

    handleCreateCustomer() {
        return this.createCustomer
    }

    onSelectCustomer(customer: CustomerModel) {
        this.dialogRef.close(customer)
    }

    onCreateCustomer() {
        this.createCustomer.emit()
    }

    onChangeKey() {
        const searchType = this.formGroup.get('searchType')?.value
        const key = this.formGroup.get('key')?.value
        switch (searchType) {
            case 'RUC':
                if (key.length === 11) {
                    this.formGroup.get('key')?.disable()
                    this.isLoading = true
                    this.customersService.getCustomersByRuc(key).subscribe({
                        next: customers => {
                            this.isLoading = false
                            this.customers = customers
                            this.formGroup.get('key')?.enable()
                        }, error: (error: HttpErrorResponse) => {
                            this.isLoading = false
                            this.formGroup.get('key')?.enable()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
                break
            case 'DNI':
                if (key.length === 8) {
                    this.formGroup.get('key')?.disable()
                    this.isLoading = true
                    this.customersService.getCustomersByDni(key).subscribe({
                        next: customers => {
                            this.isLoading = false
                            this.customers = customers
                            this.formGroup.get('key')?.enable()
                        }, error: (error: HttpErrorResponse) => {
                            this.isLoading = false
                            this.formGroup.get('key')?.enable()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
                break
            case 'CE':
                if (key.length === 9) {
                    this.formGroup.get('key')?.disable()
                    this.isLoading = true
                    this.customersService.getCustomersByCe(key).subscribe({
                        next: customers => {
                            this.isLoading = false
                            this.customers = customers
                            this.formGroup.get('key')?.enable()
                        }, error: (error: HttpErrorResponse) => {
                            this.isLoading = false
                            this.formGroup.get('key')?.enable()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
                break
            case 'MOBILE':
                if (key.length === 9) {
                    this.formGroup.get('key')?.disable()
                    this.isLoading = true
                    this.customersService.getCustomersByMobileNumber(key).subscribe({
                        next: customers => {
                            this.isLoading = false
                            this.customers = customers
                            this.formGroup.get('key')?.enable()
                        }, error: (error: HttpErrorResponse) => {
                            this.isLoading = false
                            this.formGroup.get('key')?.enable()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
                break
            default:
                this.formGroup.get('key')?.disable()
                this.isLoading = true
                this.customersService.getCustomersByKey(key).subscribe({
                    next: customers => {
                        this.isLoading = false
                        this.customers = customers
                        this.formGroup.get('key')?.enable()
                    }, error: (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.formGroup.get('key')?.enable()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
                break
        }
    }

}
