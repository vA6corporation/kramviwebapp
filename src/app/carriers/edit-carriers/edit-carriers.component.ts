import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { CarriersService } from '../carriers.service';

@Component({
    selector: 'app-edit-carriers',
    templateUrl: './edit-carriers.component.html',
    styleUrls: ['./edit-carriers.component.sass']
})
export class EditCarriersComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly carriersService: CarriersService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: ['DNI', Validators.required],
        document: [null, Validators.required],
        name: [null, Validators.required],
        carriagePlate: [null, Validators.required],
        address: null,

        mobileNumber: null,
        email: [null, Validators.email],
    });

    isLoading: boolean = false;
    maxLength: number = 11;
    private carrierId: string = '';

    ngOnInit(): void {
        this.navigationService.setTitle('Editar transportista');
        this.formGroup.get('documentType')?.valueChanges.subscribe(value => {
            switch (value) {
                case 'RUC':
                    this.formGroup.get('document')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
                    this.maxLength = 11;
                    break;
                case 'DNI':
                    this.formGroup.get('document')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
                    this.maxLength = 8;
                    break;
                case 'CE':
                    this.formGroup.get('document')?.setValidators([Validators.minLength(9), Validators.maxLength(9)]);
                    this.maxLength = 9;
                    break;
            }
            this.formGroup.get('document')?.updateValueAndValidity();
        });

        this.carrierId = this.activatedRoute.snapshot.params['carrierId']

        this.carriersService.getCarrierById(this.carrierId).subscribe({
            next: carrier => {
                this.formGroup.patchValue(carrier);
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message);
            }
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.navigationService.loadBarStart();
            this.carriersService.update(this.formGroup.value, this.carrierId).subscribe(res => {
                console.log(res);
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.router.navigate(['/carriers']);
                this.navigationService.showMessage('Registrado correctamente');
            }, (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.navigationService.showMessage(error.error.message);
            });
        }
    }

}
