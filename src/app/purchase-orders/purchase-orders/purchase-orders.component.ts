import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { Params, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component'
import { DialogDetailPurchaseOrdersComponent } from '../dialog-detail-purchase-orders/dialog-detail-purchase-orders.component'
import { PurchaseOrderModel } from '../purchase-order.model'
import { PurchaseOrdersService } from '../purchase-orders.service'
import { SheetPurchaseOrdersComponent } from '../sheet-purchase-orders/sheet-purchase-orders.component'

@Component({
    selector: 'app-purchase-orders',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './purchase-orders.component.html',
    styleUrls: ['./purchase-orders.component.sass']
})
export class PurchaseOrdersComponent {

    private readonly purchaseOrdersService = inject(PurchaseOrdersService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)
    private readonly matDialog = inject(MatDialog)
    private readonly formBuilder = inject(FormBuilder)
    private readonly matBottomSheet = inject(MatBottomSheet)

    formGroup: FormGroup = this.formBuilder.group({
        provider: this.formBuilder.group({
            id: '',
            name: ''
        }),
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
    })
    displayedColumns: string[] = ['created', 'serial', 'customer', 'user', 'charge', 'observation', 'actions']
    $dataSource = signal<PurchaseOrderModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
    private params: Params = {}

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Ordenes de compra')
        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Excel Simple', icon: 'file_download', show: false },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.fetchData()
        this.fetchCount()
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value
            Object.assign(this.params, { startDate, endDate })
            this.fetchData()
            this.fetchCount()
        }
    }

    onDialogSearchProviders() {
        const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.formGroup.patchValue({ provider })
                this.fetchData()
                this.fetchCount()
            }
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart()
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        const { provider } = this.formGroup.value
        Object.assign(this.params, { providerId: provider.id })
        this.purchaseOrdersService.getPurchaseOrdersByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(purchases => {
            this.$dataSource.set(purchases)
            this.navigationService.loadBarFinish()
        })
    }

    fetchCount() {
        this.purchaseOrdersService.countPurchaseOrders(this.params).subscribe(count => {
            this.$length.set(count)
        })
    }

    onOpenDetails(purchaseOrderId: string) {
        this.matDialog.open(DialogDetailPurchaseOrdersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseOrderId,
        })
    }

    onOptions(purchaseOrderId: string) {
        this.matBottomSheet.open(SheetPurchaseOrdersComponent, { data: purchaseOrderId })
    }

    onDelete(purchaseOrderId: string) {
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.purchaseOrdersService.softDelete(purchaseOrderId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Anulado correctamente')
                this.fetchData()
            })
        }
    }

}
