import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientsService } from '../patients.service';

@Component({
    selector: 'app-dialog-create-patients',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-patients.component.html',
    styleUrls: ['./dialog-create-patients.component.sass']
})
export class DialogCreatePatientsComponent {

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
    })
    documentTypes: string[] = ['DNI', 'CE']
    maxLength: number = 8
    isLoading: boolean = false

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
