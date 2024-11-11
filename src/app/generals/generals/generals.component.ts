import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { GeneralsService } from '../generals.service';
import { GeneralModel } from '../general.model';
import { Subscription } from 'rxjs';
import { CommonModule, formatDate } from '@angular/common';
import { NavigationService } from '../../navigation/navigation.service';
import { buildExcel } from '../../buildExcel';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-generals',
    standalone: true,
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './generals.component.html',
    styleUrls: ['./generals.component.sass']
})
export class GeneralsComponent {

    constructor(
        private readonly generalsService: GeneralsService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['createdAt', 'patient', 'worker', 'symptoms', 'actions']
    dataSource: GeneralModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Historia clinica - General')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. REGISTRO',
                'PACIENTE',
                'DOCTOR',
                'SINTOMAS',
                'DIAGNOSTICO',
            ])
            for (const general of this.dataSource) {
                body.push([
                    formatDate(general.createdAt, 'dd/MM/yyyy', 'en-US'),
                    general.patient.name.toUpperCase(),
                    general.worker.name.toUpperCase(),
                    general.symptoms,
                    general.diagnosis
                ])
            }
            const name = 'HISTORIAS CLINICAS'
            buildExcel(body, name, wscols, [], [])
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.generalsService.getGeneralsByKey(key).subscribe(patients => {
                this.navigationService.loadBarFinish()
                this.dataSource = patients
            })
        })

        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.generalsService.getGeneralsByPage(this.pageIndex + 1, this.pageSize).subscribe(generals => {
            this.navigationService.loadBarFinish()
            this.dataSource = generals
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
