import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { BanksService } from '../banks.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-edit-banks',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-banks.component.html',
    styleUrls: ['./edit-banks.component.sass']
})
export class EditBanksComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly banksService: BanksService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        bankName: 'BCP',
        currencyCode: 'PEN',
        accountNumber: ['', Validators.required],
        cci: ['', Validators.required],
        isDetraction: false
    })
    isLoading: boolean = false
    private bankId: string = ''

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
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.banksService.update(this.formGroup.value, this.bankId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.banksService.loadBanks()
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
