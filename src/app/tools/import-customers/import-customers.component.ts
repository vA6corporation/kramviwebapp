import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { PageEvent } from '@angular/material/paginator'
import { MatTable } from '@angular/material/table'
import { Subscription, lastValueFrom } from 'rxjs'
import { parseExcel } from '../../buildExcel'
import { NavigationService } from '../../navigation/navigation.service'
import { ToolsService } from '../tools.service'
import { MaterialModule } from '../../material.module'
import { MatDialog } from '@angular/material/dialog'
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-import-customers',
    imports: [MaterialModule, CommonModule],
    templateUrl: './import-customers.component.html',
    styleUrls: ['./import-customers.component.sass']
})
export class ImportCustomersComponent {

    private readonly toolsService = inject(ToolsService)
    private readonly navigationService = inject(NavigationService)
    private readonly matDialog = inject(MatDialog)

    displayedColumns: string[] = ['document', 'name', 'address', 'phone', 'email', 'actions']
    $dataSource = signal<any[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $isLoading = signal<boolean>(false)
    private distributionId: any = 0
    private handleDistribution$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleDistribution$.unsubscribe()
    }

    onDistributionChange(distributionId: any) {
        this.distributionId = distributionId
    }

    async onFileSelected(files: FileList | null, input: HTMLInputElement, table: MatTable<any>) {
        if (files && files[0]) {
            const customers = await parseExcel(files[0])
            input.value = ''
            this.$dataSource.set([])
            for (let index = 0; index < customers.length; index++) {
                const customer = customers[index]
                const numberRegex = /^\d+$/
                if (
                  customer.documento &&
                  String(customer.documento || '').length === 8 ||
                  String(customer.documento || '').length === 11
                ) {
                    if (numberRegex.test(String(customer.documento)) && customer.nombres.length > 5) {
                        const importCustomer: any = {
                            documentType: String(customer.documento || '').length === 11 ? 'RUC' : 'DNI',
                            document: String(customer.documento || ''),
                            name: customer.nombres,
                            address: customer.direccion,
                            email: customer.email,
                            phone: String(customer.celular || ''),
                        }
                        const foundCustomer = this.$dataSource().find(e => e.document === importCustomer.document)
                        if (!foundCustomer) {
                            this.$dataSource.update(values => [...values, importCustomer])
                        }
                    } else {
                        if (customer.nombres.length > 5) {
                            if (customer.celular || customer.direccion) {
                                const importCustomer: any = {
                                    documentType: 'DNI',
                                    document: '',
                                    name: customer.nombres,
                                    address: customer.direccion,
                                    email: customer.email,
                                    phone: String(customer.celular || ''),
                                }
                                this.$dataSource.update(values => [...values, importCustomer])
                            }
                        }
                    }
                } else {
                    if (customer.nombres.length > 5) {
                        if (customer.celular || customer.direccion) {
                            const importCustomer: any = {
                                documentType: 'DNI',
                                document: '',
                                name: customer.nombres,
                                address: customer.direccion,
                                email: customer.email,
                                phone: String(customer.celular || ''),
                            }
                            this.$dataSource.update(values => [...values, importCustomer])
                        }
                    }
                }
            }
            this.$dataSource.update(values => {
                values.sort((a, b) => {
                    if (a.name > b.name) {
                        return 1
                    }
                    if (a.name < b.name) {
                        return -1
                    }
                    return 0
                })
                return values
            })
            table.renderRows()
        }
    }

    handlePageEvent(event: PageEvent): void {
    }

    onDeleteCustomer(index: number, table: MatTable<any>) {
        this.$dataSource.update(values => {
            values.splice(index, 1)
            return values
        })
        table.renderRows()
    }

    async onSubmit() {
        this.navigationService.loadBarStart()
        this.$isLoading.set(true)
        let chunk = 500

        const dialogRef = this.matDialog.open(DialogProgressComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.$dataSource().length / chunk
        })

        for (let index = 0; index < this.$dataSource().length; index += chunk) {
            const temporary = this.$dataSource().slice(index, index + chunk)
            try {
                await lastValueFrom(this.toolsService.importCustomers(temporary, this.distributionId))
                dialogRef.componentInstance.onComplete()
            } catch (error) {
                if (error instanceof HttpErrorResponse) {
                    this.navigationService.showMessage(error.error.message)
                }
            }
        }
        this.$dataSource.set([])
        this.$isLoading.set(false)
        this.navigationService.loadBarFinish()
    }

}
