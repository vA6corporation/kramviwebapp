import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { SpecialtiesService } from '../specialties.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-edit-specialties',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-specialties.component.html',
    styleUrls: ['./edit-specialties.component.sass'],
})
export class EditSpecialtiesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly specialtiesService: SpecialtiesService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
    })
    isLoading: boolean = false
    maxlength: number = 11
    private specialtyId: string = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar especialidad')

        this.specialtyId = this.activatedRoute.snapshot.params['specialtyId']
        this.specialtiesService.getSpecialtyById(this.specialtyId).subscribe({
            next: specialty => {
                this.formGroup.patchValue(specialty)
            },
            error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.specialtiesService.update(this.formGroup.value, this.specialtyId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.specialtiesService.loadSpecialties()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
