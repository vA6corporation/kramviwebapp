import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../offices.service';

@Component({
    selector: 'app-create-offices',
    templateUrl: './create-offices.component.html',
    styleUrls: ['./create-offices.component.sass']
})
export class CreateOfficesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly officesService: OfficesService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        tradeName: ['', Validators.required],
        address: ['', Validators.required],
        serialPrefix: ['', Validators.required],
        codigoAnexo: ['', Validators.required],
        codigoUbigeo: ['', Validators.required],
        departamento: ['', Validators.required],
        provincia: ['', Validators.required],
        distrito: ['', Validators.required],
        urbanizacion: ['', Validators.required],
        codigoPais: ['', Validators.required],
        activityId: ['', Validators.required]
    })
    isLoading: boolean = false
    maxlength: number = 11
    activities: any[] = []

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva sucursal')
        this.officesService.getActivities().subscribe(activities => {
            this.activities = activities
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.officesService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/offices'])
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }
}
