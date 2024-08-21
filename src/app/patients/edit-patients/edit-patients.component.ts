import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientsService } from '../patients.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-edit-patients',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-patients.component.html',
    styleUrls: ['./edit-patients.component.sass']
})
export class EditPatientsComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly patientsService: PatientsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
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
    })
    isLoading: boolean = false
    maxLength: number = 11
    private patientId: string = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar paciente')
        this.patientId = this.activatedRoute.snapshot.params['patientId']
        this.patientsService.getById(this.patientId).subscribe(patient => {
            this.formGroup.patchValue(patient)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.patientsService.update(this.formGroup.value, this.patientId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
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
