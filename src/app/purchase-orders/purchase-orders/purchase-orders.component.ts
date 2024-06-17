import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogFindProvidersComponent } from '../../providers/dialog-find-providers/dialog-find-providers.component';
import { DialogDetailPurchaseOrdersComponent } from '../dialog-detail-purchase-orders/dialog-detail-purchase-orders.component';
import { PurchaseOrderModel } from '../purchase-order.model';
import { PurchaseOrdersService } from '../purchase-orders.service';
import { SheetPurchaseOrdersComponent } from '../sheet-purchase-orders/sheet-purchase-orders.component';

@Component({
    selector: 'app-purchase-orders',
    templateUrl: './purchase-orders.component.html',
    styleUrls: ['./purchase-orders.component.sass']
})
export class PurchaseOrdersComponent implements OnInit {

    constructor(
        private readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly bottomSheet: MatBottomSheet,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        provider: this.formBuilder.group({
            _id: '',
            name: ''
        }),
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
    })
    displayedColumns: string[] = ['created', 'serial', 'customer', 'user', 'charge', 'observations', 'actions']
    dataSource: PurchaseOrderModel[] = []
    length: number = 0
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

    onDialogProviders() {
        const dialogRef = this.matDialog.open(DialogFindProvidersComponent, {
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
        Object.assign(this.params, { providerId: provider._id })
        this.purchaseOrdersService.getPurchaseOrdersByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(purchases => {
            console.log(purchases)
            this.dataSource = purchases
            this.navigationService.loadBarFinish()
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

    fetchCount() {
        this.purchaseOrdersService.countPurchaseOrders(this.params).subscribe(count => {
            this.length = count
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
        this.bottomSheet.open(SheetPurchaseOrdersComponent, { data: purchaseOrderId })
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
