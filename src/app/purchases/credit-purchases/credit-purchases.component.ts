import { Component } from '@angular/core';
import { PurchasesService } from '../purchases.service';
import { NavigationService } from '../../navigation/navigation.service';
import { AuthService } from '../../auth/auth.service';
import { PurchaseModel } from '../purchase.model';
import { OfficeModel } from '../../auth/office.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '../../material.module';
import { Params, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogDetailPurchasesComponent } from '../dialog-detail-purchases/dialog-detail-purchases.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-credit-purchases',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './credit-purchases.component.html',
    styleUrl: './credit-purchases.component.sass'
})
export class CreditPurchasesComponent {

    constructor(
        private readonly purchasesService: PurchasesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
    ) { }

    displayedColumns: string[] = ['created', 'expirationAt', 'serial', 'customer', 'charge', 'payed', 'actions']
    dataSource: PurchaseModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
    params: Params = { isCredit: true }

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Pendientes de Pago')

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Excel Simple', icon: 'file_download', show: false },
        ])

        this.purchasesService.getCountPurchases(this.params).subscribe(count => {
            this.length = count
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.fetchData()
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart()
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchasesByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(purchases => {
            this.dataSource = purchases
            this.navigationService.loadBarFinish()
        })
    }

    onOpenDetails(purchaseId: string) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }


    onDeletePurchase(purchaseId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.purchasesService.deletePurchase(purchaseId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
            })
        }
    }

}
