import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { BanksService } from '../banks.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-edit-banks',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-banks.component.html',
    styleUrls: ['./edit-banks.component.sass']
})
export class EditBanksComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly navigationService = inject(NavigationService)
    private readonly banksService = inject(BanksService)

    formGroup: FormGroup = this.formBuilder.group({
        name: 'BCP',
        currencyCode: 'PEN',
        accountNumber: ['', Validators.required],
        cci: ['', Validators.required],
        isDetraction: false
    })
    $isLoading = signal<boolean>(false)
    private bankId: any = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar cuenta bancaria')
        this.bankId = this.activatedRoute.snapshot.params['bankId']
        this.banksService.getBankById(this.bankId).subscribe({
            next: bank => {
                this.formGroup.patchValue(bank)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.banksService.update(this.formGroup.value, this.bankId).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
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
