import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientsService } from '../patients.service';

@Component({
    selector: 'app-dialog-create-patients',
    templateUrl: './dialog-create-patients.component.html',
    styleUrls: ['./dialog-create-patients.component.sass']
})
export class DialogCreatePatientsComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly patientsService: PatientsService,
        private readonly dialogRef: MatDialogRef<DialogCreatePatientsComponent>,
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
    });

    documentTypes: string[] = ['DNI', 'CE'];
    maxLength: number = 11;
    isLoading: boolean = false;

    ngOnInit(): void {
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.patientsService.create(this.formGroup.value).subscribe({
                next: patient => {
                    this.isLoading = false
                    this.dialogRef.close(patient)
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }
}
