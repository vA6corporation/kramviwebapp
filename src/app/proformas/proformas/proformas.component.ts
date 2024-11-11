import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { DialogDetailProformasComponent } from '../dialog-detail-proformas/dialog-detail-proformas.component';
import { ProformaModel } from '../proforma.model';
import { ProformasService } from '../proformas.service';
import { SheetExportPdfProformasComponent } from '../sheet-export-pdf-proformas/sheet-export-pdf-proformas.component';
import { SheetPrintProformasComponent } from '../sheet-print-proformas/sheet-print-proformas.component';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-proformas',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './proformas.component.html',
    styleUrls: ['./proformas.component.sass']
})
export class ProformasComponent {

    constructor(
        private readonly proformasService: ProformasService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly bottomSheet: MatBottomSheet,
    ) { }

    displayedColumns: string[] = ['created', 'serial', 'customer', 'user', 'charge', 'observations', 'actions']
    dataSource: ProformaModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
    users: UserModel[] = []
    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        userId: '',
        isBilled: '',
    })
    private params: Params = {}
    private business: BusinessModel = new BusinessModel()

    private handleAuth$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Proformas')

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const { startDate, endDate } = this.formGroup.value
            if (startDate && endDate) {
                const chunk = 500
                const promises: Promise<any>[] = []
                this.navigationService.loadBarStart()
                for (let index = 0; index < this.length / chunk; index++) {
                    const promise = lastValueFrom(this.proformasService.getProformasByPage(index + 1, chunk, this.params))
                    promises.push(promise)
                }
                Promise.all(promises).then(values => {
                    this.navigationService.loadBarFinish()
                    const proformas = values.flat() as ProformaModel[]
                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    body.push([
                        'F. DE REGISTRO',
                        'H. DE REGISTRO',
                        'CLIENTE',
                        'RUC/DNI/CE',
                        'COMPROBANTE',
                        'Nº COMPROBANTE',
                        'TOTAL',
                        'USUARIO',
                        'ANULADO',
                        'OBSERVACIONES'
                    ])
                    for (const proforma of proformas) {
                        const { customer, sale } = proforma
                        body.push([
                            formatDate(proforma.createdAt, 'dd/MM/yyyy', 'en-US'),
                            formatDate(proforma.createdAt, 'hh:mm a', 'en-US'),
                            (customer?.name || 'VARIOS').toUpperCase(),
                            customer?.documentType,
                            sale ? sale.invoiceType : '',
                            sale ? `${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}` : '',
                            Number(proforma.charge.toFixed(2)),
                            proforma.user.name.toUpperCase(),
                            proforma.deletedAt ? 'SI' : 'NO',
                            proforma.observations
                        ])
                    }
                    const name = `PROFORMAS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}_${this.office.name.replace(/ /g, '_')}_RUC_${this.business.ruc}`
                    buildExcel(body, name, wscols, [])
                })
            } else {
                this.navigationService.showMessage('Seleccione un rango de fechas')
            }
        })

        const { startDate, endDate, pageIndex, pageSize, userId, key } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.formGroup.patchValue({ userId })

        if (key) {
            Object.assign(this.params, { key })
        }

        if (startDate && endDate) {
            this.formGroup.patchValue({ 
                startDate: new Date(startDate), 
                endDate: new Date(endDate) 
            })
        }

        this.fetchData()
        this.fetchCount()

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            // this.key = key
            this.pageIndex = 0
            const queryParams: Params = { pageIndex: 0, key }
            Object.assign(this.params, { key })

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            // this.proformasService.getCountProformasByKey(this.key).subscribe(count => {
            //     this.length = count
            // })

            this.fetchData()
            this.fetchCount()
        })
    }

    onPrint(proformaId: string) {
        this.bottomSheet.open(SheetPrintProformasComponent, { data: proformaId })
    }

    onExportPdf(proformaId: string) {
        this.bottomSheet.open(SheetExportPdfProformasComponent, { data: proformaId })
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0

            const { startDate, endDate } = this.formGroup.value
            const queryParams: Params = { startDate, endDate, pageIndex: 0, key: '' }
            Object.assign(this.params, queryParams)

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()
            this.fetchCount()
        }
    }

    onUserChange() {
        this.pageIndex = 0
        // this.key = ''

        const { userId } = this.formGroup.value
        const queryParams: Params = { userId, key: '' }
        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
    }

    onIsBilledChange() {
        this.pageIndex = 0
        // this.key = ''

        const { isBilled } = this.formGroup.value
        const queryParams: Params = { isBilled, key: '' }
        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart()
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.proformasService.getProformasByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe({
            next: proformas => {
                this.dataSource = proformas
                this.navigationService.loadBarFinish()
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    fetchCount() {
        this.proformasService.getCountProformas(this.params).subscribe(count => {
            this.length = count
        })
    }

    onOpenDetails(proformaId: string) {
        this.matDialog.open(DialogDetailProformasComponent, {
            width: '600px',
            position: { top: '20px' },
            data: proformaId,
        })
    }

    onOpenDetailsSale(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

}
