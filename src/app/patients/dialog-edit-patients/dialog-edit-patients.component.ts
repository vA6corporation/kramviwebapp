import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientModel } from '../patient.model';
import { PatientsService } from '../patients.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-edit-patients',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-patients.component.html',
    styleUrls: ['./dialog-edit-patients.component.sass']
})
export class DialogEditPatientsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly patient: PatientModel,
        private readonly formBuilder: FormBuilder,
        private readonly patientsService: PatientsService,
        private readonly dialogRef: MatDialogRef<DialogEditPatientsComponent>,
        private readonly navigationService: NavigationService,
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
    documentTypes: string[] = ['DNI', 'CE']
    isLoading: boolean = false
    maxLength: number = 8
    private patientId = this.patient._id

    ngOnInit(): void {
        this.formGroup.get('documentType')?.valueChanges.subscribe(value => {
            switch (value) {
                case 'DNI':
                    this.formGroup.get('document')?.setValidators([Validators.minLength(8), Validators.maxLength(8)])
                    this.maxLength = 8
                    break
                case 'CE':
                    this.formGroup.get('document')?.setValidators([Validators.minLength(9), Validators.maxLength(9)])
                    this.maxLength = 9
                    break
            }
            this.formGroup.get('document')?.updateValueAndValidity()
        })
        this.formGroup.patchValue(this.patient)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.patientsService.update(this.formGroup.value, this.patientId).subscribe({
                next: () => {
                    this.isLoading = false
                    Object.assign(this.patient, this.formGroup.value)
                    this.dialogRef.close(this.patient)
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
