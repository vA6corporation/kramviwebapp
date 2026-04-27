import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { ProvidersService } from '../providers.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-edit-providers',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-providers.component.html',
    styleUrls: ['./edit-providers.component.sass']
})
export class EditProvidersComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly providersService = inject(ProvidersService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        documentType: ['', Validators.required],
        document: '',
        name: ['', Validators.required],
        email: ['', Validators.email],
        phone: '',
        address: '',
    })
    $isLoading = signal<boolean>(false)
    maxLength: number = 11
    private providerId: any = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar proveedor')

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

        this.providerId = this.activatedRoute.snapshot.params['providerId']
        this.providersService.getProviderById(this.providerId).subscribe(provider => {
            this.formGroup.patchValue(provider)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.providersService.update(this.formGroup.value, this.providerId).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.navigationService.back()
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
