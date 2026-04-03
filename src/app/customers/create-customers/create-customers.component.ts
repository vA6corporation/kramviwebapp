import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { CustomerForm } from '../customer.form'
import { CustomersService } from '../customers.service'
import { DocumentType } from '../document-type.enum'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-create-customers',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-customers.component.html',
    styleUrls: ['./create-customers.component.sass']
})
export class CreateCustomersComponent {

    private readonly router = inject(Router)
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
    maxLength: number = 8

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo cliente')
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

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.customersService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/customers'])
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }
}
