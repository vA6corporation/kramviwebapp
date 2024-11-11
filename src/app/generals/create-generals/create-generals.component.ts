import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralsService } from '../generals.service';
import { WorkersService } from '../../workers/workers.service';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientModel } from '../../patients/patient.model';
import { WorkerModel } from '../../workers/worker.model';
import { DialogCreatePatientsComponent } from '../../patients/dialog-create-patients/dialog-create-patients.component';
import { DialogEditPatientsComponent } from '../../patients/dialog-edit-patients/dialog-edit-patients.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { DialogSearchPatientsComponent } from '../../patients/dialog-search-patients/dialog-search-patients.component';

@Component({
    selector: 'app-create-generals',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './create-generals.component.html',
    styleUrls: ['./create-generals.component.sass']
})
export class CreateGeneralsComponent {

    constructor(
        private readonly generalsService: GeneralsService,
        private readonly workersService: WorkersService,
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        workerId: [null, Validators.required],
        vitalFunction: ['', Validators.required],
        diseace: ['', Validators.required],
        symptoms: ['', Validators.required],
        story: ['', Validators.required],
        laboratoryExams: '',
        diagnosis: ['', Validators.required],
        treatment: ['', Validators.required],
        workPlan: ['', Validators.required],
        appointmentAt: '',
    })
    isLoading: boolean = false
    maxLength: number = 11
    patient: PatientModel | null = null
    workers: WorkerModel[] = []

    private handleClickMenu$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleWorkers$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva historia - General')
        this.navigationService.setMenu([
            // { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const dialogRef = this.matDialog.open(DialogSearchPatientsComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(patient => {
                if (patient) {
                    this.patient = patient
                }
            })

            dialogRef.componentInstance.handleCreatePatient().subscribe(() => {
                const dialogRef = this.matDialog.open(DialogCreatePatientsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })

                dialogRef.afterClosed().subscribe(patient => {
                    if (patient) {
                        this.patient = patient
                    }
                })
            })
        })
    }

    onEditPatient() {
        if (this.patient) {
            const dialogRef = this.matDialog.open(DialogEditPatientsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.patient
            })

            dialogRef.afterClosed().subscribe(patient => {
                if (patient) {
                    this.patient = patient
                }
            })
        }
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            if (this.patient === null) {
                this.navigationService.showMessage('Agrega un paciente')
                return
            }
            this.isLoading = true
            this.navigationService.loadBarStart()
            const general = this.formGroup.value
            general.patientId = this.patient._id
            this.generalsService.create(general).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/generals'])
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
