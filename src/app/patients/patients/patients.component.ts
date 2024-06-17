import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { PatientModel } from '../patient.model';
import { PatientsService } from '../patients.service';
import { formatDate } from '@angular/common';
import { buildExcel } from '../../buildExcel';

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.sass']
})
export class PatientsComponent implements OnInit {

    constructor(
        private readonly patientsService: PatientsService,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
    ) { }

    displayedColumns: string[] = ['document', 'name', 'email', 'mobileNumber', 'actions'];
    dataSource: PatientModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;

    private handleClickMenu$: Subscription = new Subscription();
    private handleSearch$: Subscription = new Subscription();

    handlePageEvent(event: PageEvent): void {
        this.patientsService.getPatientsByPage(event.pageIndex + 1, event.pageSize).subscribe(patients => {
            this.dataSource = patients
        })
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Pacientes')

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. REGISTRO',
                'T. DOCUMENTO',
                'DOCUMENTO',
                'NOMBRE',
                'SEXO',
                'EMAIL',
                'DIRECCION',
                'OCUPACION',
                'INSTRUCCION',
                'ANTECEDENTES'
            ])
            for (const patient of this.dataSource) {
                body.push([
                    formatDate(patient.createdAt, 'dd/MM/yyyy', 'en-US'),
                    patient.documentType,
                    patient.document,
                    (patient.name || '').toUpperCase(),
                    patient.sex,
                    patient.email,
                    (patient.address || '').toUpperCase(),
                    patient.occupation,
                    patient.instruction,
                    patient.criminalRecord,
                ])
            }
            const name = 'PACIENTES'
            buildExcel(body, name, wscols, [], [])
        })

        this.patientsService.getPatientsCount().subscribe(count => {
            this.length = count
        })

        this.patientsService.getPatientsByPage(this.pageIndex + 1, this.pageSize).subscribe(patients => {
            this.dataSource = patients
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.patientsService.getPatientsByKey(key).subscribe({
                next: patients => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = patients
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })
    }

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

}