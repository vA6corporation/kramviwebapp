import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { WorkersService } from '../workers.service';

@Component({
    selector: 'app-create-workers',
    templateUrl: './create-workers.component.html',
    styleUrls: ['./create-workers.component.sass']
})
export class CreateWorkersComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly workersService: WorkersService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: ['DNI', Validators.required],
        document: ['', Validators.required],
        name: ['', Validators.required],
        email: '',
        mobileNumber: '',
        birthDate: '',
        address: '',
    });
    isLoading: boolean = false
    maxLength: number = 11

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo personal')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.workersService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/workers'])
                    this.workersService.loadWorkers()
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
