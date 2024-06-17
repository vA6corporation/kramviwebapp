import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientModel } from '../patient.model';
import { PatientsService } from '../patients.service';

@Component({
    selector: 'app-dialog-edit-patients',
    templateUrl: './dialog-edit-patients.component.html',
    styleUrls: ['./dialog-edit-patients.component.sass']
})
export class DialogEditPatientsComponent implements OnInit {

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
    maxLength: number = 11
    private patientId = this.patient._id

    ngOnInit(): void {
        this.formGroup.patchValue(this.patient)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.patientsService.update(this.formGroup.value, this.patientId).subscribe(() => {
                this.isLoading = false
                Object.assign(this.patient, this.formGroup.value)
                this.dialogRef.close(this.patient)
                this.navigationService.showMessage('Se han guardado los cambios')
            }, (error: HttpErrorResponse) => {
                this.isLoading = false
                console.log(error)
                this.navigationService.showMessage(error.error.message)
            })
        }
    }

}
