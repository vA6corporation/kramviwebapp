import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PurchaseModel } from '../purchase.model';
import { PurchasesService } from '../purchases.service';

@Component({
    selector: 'app-debs',
    templateUrl: './debs.component.html',
    styleUrls: ['./debs.component.sass']
})
export class DebsComponent {

    constructor(
        private readonly purchasesService: PurchasesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
    ) { }

    displayedColumns: string[] = ['created', 'expirationAt', 'serial', 'customer', 'charge', 'payed', 'actions']
    dataSource: PurchaseModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()

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

        this.purchasesService.countCreditPurchases().subscribe(count => {
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
        this.purchasesService.getPurchasesCreditByPage(this.pageIndex + 1, this.pageSize).subscribe(purchases => {
            console.log(purchases)
            this.dataSource = purchases
            this.navigationService.loadBarFinish()
        })
    }

    onOpenDetails(saleId: string) {
        // this.matDialog.open(DialogSaleDetailsComponent, {
        //   width: '600px',
        //   position: { top: '20px' },
        //   data: saleId,
        // })
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
