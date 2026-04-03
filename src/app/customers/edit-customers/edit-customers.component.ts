import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { CustomerForm } from '../customer.form'
import { CustomersService } from '../customers.service'
import { DocumentType } from '../document-type.enum'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-edit-customers',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-customers.component.html',
    styleUrls: ['./edit-customers.component.sass']
})
export class EditCustomersComponent {

    private readonly activatedRoute = inject(ActivatedRoute)
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
    private customerId: any = ''

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
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.customersService.update(this.formGroup.value, this.customerId).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.back()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
