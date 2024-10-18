import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { Subscription, lastValueFrom } from 'rxjs';
import { parseExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { WorkerModel } from '../../workers/worker.model';
import { ToolsService } from '../tools.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-import-customers',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './import-customers.component.html',
    styleUrls: ['./import-customers.component.sass']
})
export class ImportCustomersComponent implements OnInit {

    constructor(
        private readonly specialtiesService: SpecialtiesService,
        private readonly toolsService: ToolsService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['document', 'name', 'address', 'mobileNumber', 'email', 'actions']
    dataSource: any[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    isLoading: boolean = false
    workers: WorkerModel[] = []
    private distributionId: string = ''
    private handleDistribution$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleDistribution$.unsubscribe()
    }

    ngOnInit(): void {
    }

    onDistributionChange(distributionId: string) {
        this.distributionId = distributionId
    }

    async onFileSelected(files: FileList | null, input: HTMLInputElement, table: MatTable<any>) {
        if (files && files[0]) {
            const customers = await parseExcel(files[0])
            input.value = ''
            this.dataSource = []
            for (let index = 0; index < customers.length; index++) {
                const customer = customers[index]
                if (customer.documento) {
                    if (String(customer.documento || '').length === 8 || String(customer.documento || '').length === 11) {
                        this.dataSource.push({
                            documentType: String(customer.documento || '').length === 11 ? 'RUC' : 'DNI',
                            document: String(customer.documento || ''),
                            name: customer.nombres,
                            address: customer.direccion,
                            email: customer.email,
                            mobileNumber: String(customer.celular || ''),
                        })
                    } else {
                        alert('El Numero de documento debe contener 8 o 11 caracteres: ' + `linea: ${index + 1}`)
                        break
                    }
                }
            }
            table.renderRows()
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.specialtiesService.getSpecialtiesByPage(event.pageIndex + 1, event.pageSize).subscribe(specialties => {
            this.dataSource = specialties
        })
    }

    onDeleteCustomer(index: number, table: MatTable<any>) {
        this.dataSource.splice(index, 1)
        table.renderRows()
    }

    async onSubmit() {
        this.navigationService.loadBarStart()
        this.isLoading = true
        let chunk = 1000
        for (let index = 0; index < this.dataSource.length; index += chunk) {
            const temporary = this.dataSource.slice(index, index + chunk)
            try {
                await lastValueFrom(this.toolsService.importCustomers(temporary, this.distributionId))
            } catch (error) {
                if (error instanceof HttpErrorResponse) {
                    this.navigationService.showMessage(error.error.message)
                }
            }
        }
        this.dataSource = []
        this.isLoading = false
        this.navigationService.loadBarFinish()
    }

}
