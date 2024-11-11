import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { SpecialtiesService } from '../specialties.service';

@Component({
    selector: 'app-create-specialties',
    templateUrl: './create-specialties.component.html',
    styleUrls: ['./create-specialties.component.sass']
})
export class CreateSpecialtiesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly specialtiesService: SpecialtiesService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
    })
    isLoading: boolean = false
    maxlength: number = 11

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva especialidad')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.specialtiesService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/specialties'])
                    this.specialtiesService.loadSpecialties()
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
