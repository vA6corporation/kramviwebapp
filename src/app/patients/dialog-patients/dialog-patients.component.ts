import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientModel } from '../patient.model';
import { PatientsService } from '../patients.service';

@Component({
    selector: 'app-dialog-patients',
    templateUrl: './dialog-patients.component.html',
    styleUrls: ['./dialog-patients.component.sass']
})
export class DialogPatientsComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly patientsService: PatientsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogPatientsComponent>,
    ) { }

    patients: PatientModel[] = [];
    formGroup: FormGroup = this.formBuilder.group({
        searchType: 'DNI',
        key: [null, Validators.required],
    })
    maxlength: number = 11;
    searchTypes = [
        { code: 'DNI', label: 'DNI' },
        { code: 'CE', label: 'CE' },
        { code: 'NAME', label: 'NOMBRES' },
    ]
    setting: SettingModel = new SettingModel()
    private onAdd = new EventEmitter()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    handleAddPatient() {
        return this.onAdd
    }

    onSetPatient(patient: PatientModel) {
        this.dialogRef.close(patient)
    }

    onCreatePatient() {
        this.onAdd.emit()
    }

    onChangeKey() {
        const searchType = this.formGroup.get('searchType')?.value
        const key = this.formGroup.get('key')?.value
        switch (searchType) {
            case 'DNI':
                if (key.length === 8) {
                    this.formGroup.get('key')?.disable()
                    this.patientsService.getPatientsByDocument(searchType, key).subscribe(patients => {
                        this.patients = patients
                        this.formGroup.get('key')?.enable()
                    }, (error: HttpErrorResponse) => {
                        this.formGroup.get('key')?.enable()
                        this.navigationService.showMessage(error.error.message)
                    })
                }
                break
            default:
                this.formGroup.get('key')?.disable()
                this.patientsService.getPatientsByKey(key).subscribe(patients => {
                    this.patients = patients
                    this.formGroup.get('key')?.enable()
                }, (error: HttpErrorResponse) => {
                    this.formGroup.get('key')?.enable()
                    this.navigationService.showMessage(error.error.message)
                })
                break
        }
    }
}
