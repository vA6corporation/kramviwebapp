import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientsService } from '../patients.service';

@Component({
    selector: 'app-create-patients',
    templateUrl: './create-patients.component.html',
    styleUrls: ['./create-patients.component.sass']
})
export class CreatePatientsComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly patientsService: PatientsService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: [null, Validators.required],
        document: [null, Validators.required],
        name: [null, Validators.required],
        birthdate: [null, Validators.required],
        sex: [null, Validators.required],
        email: null,
        mobileNumber: null,
        address: null,
        district: null,
        occupation: null,
        instruction: null,
        criminalRecord: null
    });

    isLoading: boolean = false;
    maxLength: number = 11;

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo paciente');
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.navigationService.loadBarStart();
            this.patientsService.create(this.formGroup.value).subscribe(res => {
                console.log(res);
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.router.navigate(['/patients']);
                this.navigationService.showMessage('Registrado correctamente');
            }, (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.navigationService.showMessage(error.error.message);
            });
        }
    }
}
