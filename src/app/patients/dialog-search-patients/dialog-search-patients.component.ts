import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientsService } from '../patients.service';
import { NavigationService } from '../../navigation/navigation.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PatientModel } from '../patient.model';
import { SettingModel } from '../../auth/setting.model';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-search-patients',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dialog-search-patients.component.html',
  styleUrl: './dialog-search-patients.component.sass'
})
export class DialogSearchPatientsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly patientsService: PatientsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogSearchPatientsComponent>,
    ) { }

    patients: PatientModel[] = [];
    formGroup: FormGroup = this.formBuilder.group({
        searchType: 'DNI',
        key: [null, Validators.required],
    })
    maxlength: number = 11
    searchTypes = [
        { code: 'DNI', label: 'DNI' },
        { code: 'CE', label: 'CE' },
        { code: 'NAME', label: 'NOMBRES' },
    ]
    setting: SettingModel = new SettingModel()
    
    private createPatient$ = new EventEmitter()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    handleCreatePatient() {
        return this.createPatient$
    }

    onSelectPatient(patient: PatientModel) {
        this.dialogRef.close(patient)
    }

    onCreatePatient() {
        this.createPatient$.emit()
    }

    onChangeKey() {
        const { searchType, key } = this.formGroup.value
        switch (searchType) {
            case 'DNI':
                if (key.length === 8) {
                    this.formGroup.get('key')?.disable()
                    this.patientsService.getPatientsByDocument(searchType, key).subscribe({
                        next: patients => {
                            this.patients = patients
                            this.formGroup.get('key')?.enable()
                        }, error: (error: HttpErrorResponse) => {
                            this.formGroup.get('key')?.enable()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
                break
            default:
                this.formGroup.get('key')?.disable()
                this.patientsService.getPatientsByKey(key).subscribe({
                    next: patients => {
                        this.patients = patients
                        this.formGroup.get('key')?.enable()
                    }, error: (error: HttpErrorResponse) => {
                        this.formGroup.get('key')?.enable()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
                break
        }
    }

}
