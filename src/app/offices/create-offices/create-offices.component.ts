import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../offices.service';

@Component({
    selector: 'app-create-offices',
    templateUrl: './create-offices.component.html',
    styleUrls: ['./create-offices.component.sass']
})
export class CreateOfficesComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly officesService: OfficesService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        tradeName: [null, Validators.required],
        address: [null, Validators.required],
        serialPrefix: [null, Validators.required],
        codigoAnexo: [null, Validators.required],
        codigoUbigeo: [null, Validators.required],
        departamento: [null, Validators.required],
        provincia: [null, Validators.required],
        distrito: [null, Validators.required],
        urbanizacion: [null, Validators.required],
        codigoPais: [null, Validators.required],
        activityId: [null, Validators.required]
    });
    isLoading: boolean = false;
    maxlength: number = 11;
    activities: any[] = [];

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva sucursal');
        this.officesService.getActivities().subscribe(activities => {
            this.activities = activities;
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.navigationService.loadBarStart();
            this.officesService.create(this.formGroup.value).subscribe(res => {
                console.log(res);
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.router.navigate(['/offices']);
                this.navigationService.showMessage('Registrado correctamente');
            }, (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.navigationService.showMessage(error.error.message);
            });
        }
    }
}
