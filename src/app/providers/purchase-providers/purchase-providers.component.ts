import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { DialogDetailPurchasesComponent } from '../../purchases/dialog-detail-purchases/dialog-detail-purchases.component'
import { NavigationService } from '../../navigation/navigation.service'
import { PurchaseItemModel } from '../../purchases/purchase-item.model'
import { PurchasesService } from '../../purchases/purchases.service'
import { ProvidersService } from '../providers.service'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Subscription, lastValueFrom } from 'rxjs'
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component'
import { ProviderModel } from '../provider.model'
import { buildExcel } from '../../buildExcel'
import { CommonModule, formatDate } from '@angular/common'
import { OfficeModel } from '../../offices/office.model'
import { AuthService } from '../../auth/auth.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-purchase-providers',
    imports: [MaterialModule, CommonModule, ReactiveFormsModule],
    templateUrl: './purchase-providers.component.html',
    styleUrl: './purchase-providers.component.sass',
})
export class PurchaseProvidersComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly purchasesService = inject(PurchasesService)
    private readonly providersService = inject(ProvidersService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    displayedColumns: string[] = ['createdAt', 'product', 'quantity', 'price', 'total', 'invoice', 'actions']
    $dataSource = signal<PurchaseItemModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $office = signal<OfficeModel>(new OfficeModel())
    private providerId: any = ''
    private provider: ProviderModel | null = null
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.providerId = this.activatedRoute.snapshot.params['providerId']
        Object.assign(this.params, { providerId: this.providerId })
        const { startDate, endDate } = this.activatedRoute.snapshot.queryParams


        if (startDate && endDate) {
            this.formGroup.patchValue({
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            })
            Object.assign(this.params, { startDate, endDate })
        }

        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$office.set(auth.office)
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            const purchaseItems = []
            const chunk = 500
            const dialogRef = this.matDialog.open(DialogProgressComponent, {
                width: '600px',
                position: { top: '20px' },
                data: length / chunk
            })

            for (let index = 0; index < length / chunk; index++) {
                const values = await lastValueFrom(this.purchasesService.getPurchaseItemsByProviderPage(this.providerId, this.pageIndex + 1, chunk, this.params))
                dialogRef.componentInstance.onComplete()
                purchaseItems.push(...values)
            }

            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. VENTA',
                'PRODUCTO',
                'CANTIDAD',
                'C. UNITARIO',
                'TOTAL',
                'COMPROBANTE',
            ])
            for (const purchaseItem of purchaseItems) {
                body.push([
                    formatDate(new Date(purchaseItem.createdAt), 'dd/MM/yyyy', 'en-US'),
                    purchaseItem.fullName.toUpperCase(),
                    purchaseItem.quantity,
                    Number(purchaseItem.cost.toFixed(2)),
                    Number((purchaseItem.cost * purchaseItem.quantity).toFixed(2)),
                    purchaseItem.purchase?.serie
                ])
            }
            const name = `COMPRAS_${this.provider?.name.replace(/ /g, '_')}`
            buildExcel(body, name, wscols, [])
        })

        this.providersService.getProviderById(this.providerId).subscribe(provider => {
            this.provider = provider
            this.navigationService.setTitle(`Historial de ventas ${provider.name}`)
        })
        this.fetchData()
        this.fetchCount()
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0

            const { startDate, endDate } = this.formGroup.value

            Object.assign(this.params, { startDate, endDate })

            const queryParams: Params = { startDate: startDate, endDate: endDate, pageIndex: 0 }


            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchCount()
            this.fetchData()
        }
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

    onOpenDetails(purchaseId: any) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }

    fetchCount() {
        this.purchasesService.getCountPurchaseItems(this.params).subscribe(count => {
            this.$length.set(count)
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseItemsByProviderPage(this.providerId, this.pageIndex + 1, this.pageSize, this.params).subscribe(purchaseItems => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(purchaseItems)
        })
    }

}
