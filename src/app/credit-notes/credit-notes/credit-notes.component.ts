import { Component, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { Subscription, lastValueFrom } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { buildExcel } from '../../buildExcel'
import { DialogDeleteSaleComponent } from '../../sales/dialog-delete-sale/dialog-delete-sale.component'
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../../users/users.service'
import { CreditNoteModel } from '../credit-note.model'
import { CreditNotesService } from '../credit-notes.service'
import { DialogAdminCreditNotesComponent } from '../dialog-admin-credit-notes/dialog-admin-credit-notes.component'
import { DialogDetailCreditNotesComponent } from '../dialog-detail-credit-notes/dialog-detail-credit-notes.component'
import { SheetExportPdfCreditNotesComponent } from '../sheet-export-pdf-credit-notes/sheet-export-pdf-credit-notes.component'
import { SheetPrintCreditNotesComponent } from '../sheet-print-credit-notes/sheet-print-credit-notes.component'
import { MaterialModule } from '../../material.module'
import { InvoiceCode } from '../../sales/invoice-code.enum'

@Component({
    selector: 'app-credit-notes',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './credit-notes.component.html',
    styleUrls: ['./credit-notes.component.sass']
})
export class CreditNotesComponent {

    private readonly creditNotesService = inject(CreditNotesService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly navigationService = inject(NavigationService)
    private readonly formBuilder = inject(FormBuilder)
    private readonly authService = inject(AuthService)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly matBottomSheet = inject(MatBottomSheet)
    private readonly usersService = inject(UsersService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '',
        userId: '',
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    $users = signal<UserModel[]>([])
    displayedColumns: string[] = ['created', 'serial', 'sale', 'customer', 'user', 'charge', 'observation', 'actions']
    $dataSource = signal<CreditNoteModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $office = signal<OfficeModel>(new OfficeModel())
    invoiceCode = InvoiceCode
    private business: BusinessModel = new BusinessModel()
    private categories: CategoryModel[] = []
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Notas de credito')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$office.set(auth.office)
            this.business = auth.business
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.$users.set(users)
        })

        const queryParams = this.activatedRoute.snapshot.queryParams
        const { startDate, endDate, pageIndex, pageSize, invoiceCode } = queryParams
        Object.assign(this.params, queryParams)

        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.formGroup.get('invoiceCode')?.patchValue(invoiceCode || '')

        if (startDate && endDate) {
            this.formGroup.patchValue({ startDate: new Date(startDate), endDate: new Date(endDate) })
        }

        this.creditNotesService.getCountCreditNotes(this.params).subscribe(count => {
            this.$length.set(count)
        })

        this.fetchData()

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'excel_detail', label: 'Excel detallado', icon: 'file_download', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            switch (id) {
                case 'excel_simple': {
                    const chunk = 500
                    const creditNotes: CreditNoteModel[] = []

                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.$length() / chunk
                    })

                    const { startDate, endDate } = this.formGroup.value

                    if (startDate && endDate) {
                        for (let index = 0; index < this.$length() / chunk; index++) {
                            const values = await lastValueFrom(this.creditNotesService.getCreditNotesByPage(index + 1, chunk, this.params))
                            dialogRef.componentInstance.onComplete()
                            creditNotes.push(...values)
                        }

                        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                        let body = []
                        body.push([
                            'F. EMISION',
                            'RUC/DNI/CE',
                            'CLIENTE',
                            'COMPROBANTE ANULADO',
                            'COMPROBANTE EMITIDO',
                            'Nº COMPROBANTE',
                            'MONEDA',
                            'BASE',
                            'IMPORTE T.',
                            'IGV',
                            'GRAVADO',
                            'EXONERADO',
                            'INAFECTO',
                            'GRATUITO',
                            'ANULADO',
                            'USUARIO',
                            'OBSERVACIONES',
                        ])
                        for (const creditNote of creditNotes) {
                            const { customer, sale } = creditNote
                            const declare = this.getStatusDeclare(creditNote)
                            body.push([
                                formatDate(creditNote.createdAt, 'dd/MM/yyyy', 'en-US'),
                                customer?.document,
                                customer?.name,
                                `${sale.invoicePrefix}${this.$office().serialPrefix}-${sale.invoiceNumber}`,
                                formatDate(sale.createdAt, 'dd/MM/yyyy', 'en-US'),
                                `${creditNote.invoicePrefix}${this.$office().serialPrefix}-${creditNote.invoiceNumber}`,
                                creditNote.currencyCode,
                                declare ? -Number((creditNote.charge - creditNote.igv).toFixed(2)) : null,
                                declare ? -Number((creditNote.charge || 0).toFixed(2)) : null,
                                declare ? -Number((creditNote.igv || 0).toFixed(2)) : null,
                                declare ? -Number((creditNote.gravado || 0).toFixed(2)) : null,
                                declare ? -Number((creditNote.exonerado || 0).toFixed(2)) : null,
                                declare ? -Number((creditNote.inafecto || 0).toFixed(2)) : null,
                                declare ? -Number((creditNote.gratuito || 0).toFixed(2)) : null,
                                creditNote.deletedAt ? 'SI' : 'NO',
                                creditNote.user.name.toUpperCase(),
                                creditNote.observation,
                            ])
                        }
                        const name = `NOTAS_DE_CREDITO_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}`
                        buildExcel(body, name, wscols, [], [])
                    } else {
                        this.navigationService.showMessage('Seleccione un rango de fechas')
                    }
                    break
                }
                case 'excel_detail': {
                    this.excelDetails()
                    break
                }
                default:
                    break
            }
        })
    }

    excelDetails() {
        const { startDate, endDate } = this.formGroup.value
        if (startDate && endDate) {
            this.navigationService.loadBarStart()
            const chunk = 500
            const promises: Promise<any>[] = []

            for (let index = 0; index < this.$length() / chunk; index++) {
                const promise = lastValueFrom(this.creditNotesService.getCreditNotesByRangeDatePageWithItems(startDate, endDate, index + 1, chunk))
                promises.push(promise)
            }

            Promise.all(promises).then(values => {
                const creditNotes: CreditNoteModel[] = values.flat()
                this.navigationService.loadBarFinish()
                const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                let body = []
                body.push([
                    'F. EMISION',
                    'RUC/DNI/CE',
                    'CLIENTE',
                    'DIRECCION',
                    'TELEFONO',
                    'Nº COMPROBANTE',
                    'PRODUCTO',
                    'CATEGORIA',
                    'CANTIDAD',
                    'PRECIO U.',
                    'TOTAL',
                    'MONEDA',
                    'BONIFICACION',
                    'USUARIO',
                    'ANULADO',
                    'OBSERVACIONES'
                ])

                for (const creditNote of creditNotes) {
                    const { customer, creditNoteItems } = creditNote
                    for (const creditNoteItem of creditNoteItems) {
                        body.push([
                            formatDate(creditNote.createdAt, 'dd/MM/yyyy', 'en-US'),
                            customer?.document,
                            (customer?.name || 'VARIOS').toUpperCase(),
                            customer?.address,
                            customer?.phone,
                            `${creditNote.invoicePrefix}${this.$office().serialPrefix}-${creditNote.invoiceNumber}`,
                            creditNoteItem.fullName.toUpperCase(),
                            this.categories.find(e => e.id === creditNoteItem.categoryId)?.name.toUpperCase(),
                            Number(creditNoteItem.quantity.toFixed(2)),
                            creditNoteItem.price,
                            Number((creditNoteItem.price * creditNoteItem.quantity).toFixed(2)),
                            creditNote.currencyCode,
                            creditNoteItem.igvCode === '11' ? 'SI' : 'NO',
                            creditNote.user.name.toUpperCase(),
                            creditNote.deletedAt ? 'SI' : 'NO',
                            creditNote.observation,
                        ])
                    }
                }
                const name = `NOTAS_DE_CREDITO_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}_${this.$office().name.replace(/ /g, '_')}_RUC_${this.business.ruc}`
                buildExcel(body, name, wscols, [])
            }, (error: HttpErrorResponse) => {
                console.log(error)
                this.navigationService.loadBarFinish()
            })
        } else {
            this.navigationService.showMessage('Seleccione un rango de fechas')
        }
    }

    getStatusDeclare(creditNote: CreditNoteModel): boolean {
        if (creditNote.deletedAt && creditNote.ticket && creditNote.ticket.sunatCode === '0') {
            return false
        }
        if (creditNote.cdr === null) {
            return false
        }
        if (creditNote.cdr.sunatCode !== '0') {
            return false
        }
        return true
    }

    onUserChange(userId: string) {
        this.pageIndex = 0
        const queryParams: Params = { userId, key: null }

        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart()
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0
            const { startDate, endDate } = this.formGroup.value

            const queryParams: Params = { startDate, endDate, pageIndex: 0 }
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

    fetchCount() {
        this.creditNotesService.getCountCreditNotes(this.params).subscribe(count => {
            this.$length.set(count)
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.creditNotesService.getCreditNotesByPage(
            this.pageIndex + 1,
            this.pageSize,
            this.params
        ).subscribe({
            next: creditNotes => {
                this.navigationService.loadBarFinish()
                this.$dataSource.set(creditNotes)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onClickOptions(event: MouseEvent, creditNoteId: any) {
        if (event.ctrlKey) {
            event.stopPropagation()
            const dialogRef = this.matDialog.open(DialogAdminCreditNotesComponent, {
                width: '600px',
                position: { top: '20px' },
                data: creditNoteId,
            })

            dialogRef.componentInstance.handleUpdate().subscribe(() => {
                this.fetchData()
            })
        }
    }

    onOpenDetails(creditNoteId: any) {
        this.matDialog.open(DialogDetailCreditNotesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: creditNoteId,
        })
    }

    onPrint(creditNoteId: any) {
        this.matBottomSheet.open(SheetPrintCreditNotesComponent, { data: creditNoteId })
    }

    onExportPdf(creditNoteId: any) {
        this.matBottomSheet.open(SheetExportPdfCreditNotesComponent, { data: creditNoteId })
    }

    onSendInvoice(creditNoteId: any) {
        this.navigationService.loadBarStart()
        this.creditNotesService.sendCreditNote(creditNoteId).subscribe(cdr => {
            this.fetchData()
            this.navigationService.showMessage('Enviado a sunat')
            this.navigationService.loadBarFinish()
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message)
            this.navigationService.loadBarFinish()
        })
    }

    onDeleteInvoice(creditNote: CreditNoteModel) {
        const dialogRef = this.matDialog.open(DialogDeleteSaleComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(reason => {
            if (reason) {
                this.navigationService.loadBarStart()
                if (creditNote.cdr === null) {
                    this.creditNotesService.sendCreditNote(creditNote.id).subscribe(cdr => {

                        this.creditNotesService.cancelCreditNote(creditNote.id, reason).subscribe(() => {
                            this.navigationService.loadBarFinish()
                            this.fetchData()
                        }, (error: HttpErrorResponse) => {
                            this.navigationService.showMessage(error.error.message)
                        })

                    }, (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                    })
                } else {
                    this.creditNotesService.cancelCreditNote(creditNote.id, reason).subscribe(() => {
                        this.navigationService.loadBarFinish()
                        this.fetchData()
                    }, (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                    })
                }
            } else {
                this.navigationService.showMessage('Debe indicar el motivo')
            }
        })
    }

    async onDownloadCdr(creditNoteId: number) {
        //this.matBottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        const creditNote = await lastValueFrom(this.creditNotesService.getCreditNoteById(creditNoteId))
        const fileName = `07-${creditNote.invoicePrefix}${this.$office().serialPrefix}-${creditNote.invoiceNumber}.zip`
        if (creditNote.cdr) {
            try {
                const blobCdr = await this.creditNotesService.getCdr(creditNote.cdr.id)
                const urlCdr = window.URL.createObjectURL(blobCdr)
                this.navigationService.loadBarFinish()
                this.downloadFile(urlCdr, 'R-' + fileName)
            } catch (error) {
            }
        } else {
            this.navigationService.showMessage('Debe enviar a SUNAT')
            this.navigationService.loadBarFinish()
           // this.invoicesService.sendInvoice(this.saleId).subscribe({
           //     next: () => {
           //         //this.onSendInvoice$.emit()
           //         this.onDownloadCdr()
           //     }, error: (error: HttpErrorResponse) => {
           //         this.navigationService.showMessage(error.error.message)
           //         this.navigationService.loadBarFinish()
           //     }
           // })
        }
    }

    async onDownloadXml(creditNoteId: number) {
        //this.matBottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        const creditNote = await lastValueFrom(this.creditNotesService.getCreditNoteById(creditNoteId))
        const fileName = `07-${creditNote.invoicePrefix}${this.$office().serialPrefix}-${creditNote.invoiceNumber}.zip`
        if (creditNote.cdr) {
            try {
                const blobXml = await this.creditNotesService.getXml(creditNote.cdr.id)
                const urlXml = window.URL.createObjectURL(blobXml)
                this.navigationService.loadBarFinish()
                this.downloadFile(urlXml, fileName)
            } catch (error) {
            }
        } else {
            this.navigationService.showMessage('Debe enviar a SUNAT')
            this.navigationService.loadBarFinish()
           // this.invoicesService.sendInvoice(this.saleId).subscribe({
           //     next: () => {
           //         this.onSendInvoice$.emit()
           //         //this.onDownloadXml()
           //     }, error: (error: HttpErrorResponse) => {
           //         this.navigationService.showMessage(error.error.message)
           //         this.navigationService.loadBarFinish()
           //     }
           // })
        }
    }

    downloadFile(url: string, fileName: string) {
        const link = document.createElement("a")
        link.download = fileName
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

}
