import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { BanksService } from '../banks.service';

@Component({
    selector: 'app-create-banks',
    templateUrl: './create-banks.component.html',
    styleUrls: ['./create-banks.component.sass']
})
export class CreateBanksComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly banksService: BanksService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        bankName: 'BCP',
        currencyCode: 'PEN',
        accountNumber: ['', Validators.required],
        cci: ['', Validators.required]
    })
    isLoading: boolean = false

    ngOnInit() {
        this.navigationService.setTitle('Nueva cuenta bancaria')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.banksService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                    this.banksService.loadBanks()
                    this.router.navigate(['/banks'])
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}