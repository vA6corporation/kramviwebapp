import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { CarriersService } from '../carriers.service';

@Component({
    selector: 'app-create-carriers',
    templateUrl: './create-carriers.component.html',
    styleUrls: ['./create-carriers.component.sass']
})
export class CreateCarriersComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly carriersService: CarriersService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: ['RUC', Validators.required],
        document: [null, Validators.required],
        name: [null, Validators.required],
        carriagePlate: '',
        licenseNumber: '',
        mobileNumber: '',
        email: '',
    });

    isLoading: boolean = false;
    maxLength: number = 11;

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo transportista');

        this.formGroup.get('documentType')?.valueChanges.subscribe(value => {
            switch (value) {
                case 'RUC':
                    this.formGroup.get('document')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
                    this.maxLength = 11;
                    break;
                case 'DNI':
                    this.formGroup.get('document')?.setValidators([Validators.minLength(8), Validators.maxLength(8)]);
                    this.maxLength = 8;
                    break;
                case 'CE':
                    this.formGroup.get('document')?.setValidators([Validators.minLength(9), Validators.maxLength(9)]);
                    this.maxLength = 9;
                    break;
            }
            this.formGroup.get('document')?.updateValueAndValidity();
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.navigationService.loadBarStart();
            this.carriersService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.navigationService.loadBarFinish();
                    this.router.navigate(['/carriers']);
                    this.navigationService.showMessage('Registrado correctamente');
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.navigationService.loadBarFinish();
                    this.navigationService.showMessage(error.error.message);
                }
            })
        }
    }

}
