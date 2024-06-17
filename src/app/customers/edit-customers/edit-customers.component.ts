import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { CustomerForm } from '../customer.form';
import { CustomersService } from '../customers.service';
import { DocumentType } from '../document-type.enum';

@Component({
    selector: 'app-edit-customers',
    templateUrl: './edit-customers.component.html',
    styleUrls: ['./edit-customers.component.sass']
})
export class EditCustomersComponent implements OnInit {

    constructor(
        private readonly customersService: CustomersService,
        private readonly activatedRoute: ActivatedRoute,
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
    maxLength: number = 11
    private customerId: string = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar cliente')
        this.formGroup.get('documentType')?.valueChanges.subscribe(value => {
            switch (value) {
                case DocumentType.RUC:
                    this.formGroup.get('document')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)])
                    this.maxLength = 11
                    break
                case DocumentType.DNI:
                    this.formGroup.get('document')?.setValidators([Validators.minLength(8), Validators.maxLength(8)])
                    this.maxLength = 8
                    break
                case DocumentType.CE:
                    this.formGroup.get('document')?.setValidators([Validators.minLength(9), Validators.maxLength(9)])
                    this.maxLength = 9
                    break
            }
            this.formGroup.get('document')?.updateValueAndValidity()
        })

        this.customerId = this.activatedRoute.snapshot.params['customerId']
        this.customersService.getCustomerById(this.customerId).subscribe(customer => {
            this.formGroup.patchValue(customer)
            for (const address of customer.addresses) {
                this.formArray.push(new FormControl(address, { nonNullable: true, validators: Validators.required }))
            }
        })
    }

    onAddAddress() {
        const formControl = new FormControl('', { nonNullable: true, validators: Validators.required })
        this.formArray.push(formControl)
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.customersService.update(this.formGroup.value, this.customerId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
