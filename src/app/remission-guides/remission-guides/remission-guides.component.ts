import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { SaleModel } from '../../sales/sale.model';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { DialogDetailRemissionGuidesComponent } from '../dialog-detail-remission-guides/dialog-detail-remission-guides.component';
import { RemissionGuideModel } from '../remission-guide.model';
import { RemissionGuidesService } from '../remission-guides.service';
import { SheetRemissionGuidesComponent } from '../sheet-remission-guides/sheet-remission-guides.component';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-remission-guides',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './remission-guides.component.html',
    styleUrls: ['./remission-guides.component.sass'],
})
export class RemissionGuidesComponent {

    constructor(
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly usersService: UsersService,
        private readonly router: Router,
        private readonly matDialog: MatDialog,
        private readonly bottomSheet: MatBottomSheet,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: '',
        userId: '',
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    users: UserModel[] = []
    displayedColumns: string[] = ['created', 'serial', 'sale', 'customer', 'user', 'actions']
    dataSource: RemissionGuideModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Guias de remision')

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        const queryParams = this.activatedRoute.snapshot.queryParams
        const { startDate, endDate, pageIndex, pageSize, userId } = queryParams
        Object.assign(this.params, queryParams)
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.formGroup.patchValue({ userId: userId || '' })

        if (startDate && endDate) {
            this.formGroup.patchValue({ startDate: new Date(startDate) })
            this.formGroup.patchValue({ endDate: new Date(endDate) })
        }

        this.fetchData()
        this.fetchCount()

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office

            if (!auth.business.clientId) {
                this.navigationService.showDialogMessage('Es necesario activar las credenciales de API Sunat para poder enviar las guias de remision, contacte al soporte tecnico')
            }
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'excel_simple': {
                    this.excelSimple()
                    break
                }
                default:
                    break
            }
        })
    }

    excelSimple() {
        const chunk = 500
        const promises: Promise<any>[] = []

        for (let index = 0; index < this.length / chunk; index++) {
            const promise = lastValueFrom(this.remissionGuidesService.getRemissionGuidesByPage(index + 1, chunk, this.params))
            promises.push(promise)
        }

        this.navigationService.loadBarStart()
        Promise.all(promises).then(values => {
            this.navigationService.loadBarFinish()
            const remissionGuides: RemissionGuideModel[] = values.flat()
            this.navigationService.loadBarFinish()
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. EMISION',
                'H. EMISION',
                'RUC/DNI',
                'CLIENTE',
                'DIRECCION',
                'DISTRITO',
                'CELULAR',
                'Nº COMPROBANTE',
                'USUARIO',
                'OBSERVACIONES',
                'ANULADO'
            ])
            for (const remissionGuide of remissionGuides) {
                const { customer, user } = remissionGuide
                body.push([
                    formatDate(remissionGuide.createdAt, 'dd/MM/yyyy', 'en-US'),
                    formatDate(remissionGuide.createdAt, 'h:mm', 'en-US'),
                    customer?.document,
                    customer?.name,
                    customer?.addresses[0],
                    customer?.locationName,
                    customer?.mobileNumber,
                    `T${this.office.serialPrefix}-${remissionGuide.remissionGuideNumber}`,
                    user.name,
                    remissionGuide.observations,
                    remissionGuide.deletedAt ? 'SI' : 'NO'
                ])
            }
            const name = `GUIAS DE REMISION`
            buildExcel(body, name, wscols, [], [])
        })
    }

    onUserChange(userId: string) {
        const queryParams: Params = { userId }
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
        this.remissionGuidesService.getCountRemissionGuides(this.params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.remissionGuidesService.getRemissionGuidesByPage(
            this.pageIndex + 1,
            this.pageSize,
            this.params
        ).subscribe(creditNotes => {
            console.log(creditNotes)
            this.navigationService.loadBarFinish()
            this.dataSource = creditNotes
        })
    }

    onOpenDetails(remissionGuideId: string) {
        this.matDialog.open(DialogDetailRemissionGuidesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: remissionGuideId,
        })
    }

    onPrint(remissionGuideId: string) {
        this.remissionGuidesService.getRemissionGuideById(remissionGuideId).subscribe(remissionGuide => {
            this.printService.printA4RemissionGuide(remissionGuide)
        })
    }

    onPrintTicket80mm(remissionGuideId: string) {
        this.remissionGuidesService.getRemissionGuideById(remissionGuideId).subscribe(remissionGuide => {
            this.printService.printRemissionGuideTicket80mm(remissionGuide)
        })
    }

    // onExportPdfTicket(remissionGuideId: string) {
    //     this.remissionGuidesService.getRemissionGuideById(remissionGuideId).subscribe(remissionGuide => {
    //         this.printService.exportRemissionGuidePdfTicket80mm(remissionGuide)
    //     })
    // }

    // onExportPdf(remissionGuideId: string) {
    //     this.remissionGuidesService.getRemissionGuideById(remissionGuideId).subscribe(remissionGuide => {
    //         this.printService.exportPdfA4RemissionGuide(remissionGuide)
    //     })
    // }

    // onSendRemissionGuide(remissionGuideId: string) {
    //     this.navigationService.loadBarStart()
    //     if (this.sunattk) {
    //         this.remissionGuidesService.sendRemissionGuide(remissionGuideId, this.sunattk).subscribe({
    //             next: cdr => {
    //                 this.fetchData()
    //                 this.navigationService.showMessage('Enviado a sunat')
    //                 this.navigationService.loadBarFinish()
    //             }, error: (error: HttpErrorResponse) => {
    //                 this.navigationService.showMessage(error.error.message)
    //                 this.navigationService.loadBarFinish()
    //             }
    //         })
    //     } else {
    //         const params: Params = {
    //             clientId: this.business.clientId,
    //             clientSecret: this.business.clientSecret
    //         }
    //         this.remissionGuidesService.getSunatToken(params).subscribe({
    //             next: res => {
    //                 this.navigationService.loadBarFinish()
    //                 this.sunattk = res.sunattk
    //                 this.onSendRemissionGuide(remissionGuideId)
    //             }, error: (error: HttpErrorResponse) => {
    //                 this.navigationService.loadBarFinish()
    //                 this.navigationService.showMessage(error.error.message)
    //             }
    //         })
    //     }
    // }

    onOptions(remissionGuideId: string) {
        const bottomSheetRef = this.bottomSheet.open(SheetRemissionGuidesComponent, { data: remissionGuideId })
        bottomSheetRef.instance.handleSendRemissionGuide().subscribe(() => {
            this.fetchData()
        })
    }

    onDeleteInvoice(sale: SaleModel) {
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            if (sale.invoiceType === 'NOTA DE VENTA') {
                this.navigationService.loadBarStart()
                // this.invoicesService.cancelTicket(sale._id).subscribe(response => {
                //   console.log(response)
                //   this.fetchData()
                //   this.navigationService.loadBarFinish()
                //   this.navigationService.showMessage('Comprobante anulado')
                // })
            } else {

            }
        }
    }

}
