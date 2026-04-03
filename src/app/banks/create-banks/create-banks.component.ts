import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { BanksService } from '../banks.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-create-banks',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-banks.component.html',
    styleUrls: ['./create-banks.component.sass']
})
export class CreateBanksComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly banksService = inject(BanksService)

    formGroup: FormGroup = this.formBuilder.group({
        name: 'BCP',
        currencyCode: 'PEN',
        accountNumber: ['', Validators.required],
        cci: ['', Validators.required],
        isDetraction: false,
    })
    $isLoading = signal<boolean>(false)

    ngOnInit() {
        this.navigationService.setTitle('Nueva cuenta bancaria')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.banksService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                    this.banksService.loadBanks()
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
