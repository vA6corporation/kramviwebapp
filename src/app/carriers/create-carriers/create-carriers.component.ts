import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { CarriersService } from '../carriers.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-create-carriers',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-carriers.component.html',
    styleUrls: ['./create-carriers.component.sass'],
})
export class CreateCarriersComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly carriersService = inject(CarriersService)
    private readonly navigationService = inject(NavigationService)
    private readonly router = inject(Router)

    formGroup: FormGroup = this.formBuilder.group({
        documentType: ['DNI', Validators.required],
        document: ['', Validators.required],
        name: ['', Validators.required],
        carrierPlate: '',
        licenseNumber: '',
        address: '',
        phone: '',
        email: ['', Validators.email],
    })
    $isLoading = signal<boolean>(false)
    maxLength: number = 11

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo transportista')

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
            this.carriersService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/carriers'])
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
