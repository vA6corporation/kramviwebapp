import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogDetailPurchasesComponent } from '../../purchases/dialog-detail-purchases/dialog-detail-purchases.component';
import { PurchaseModel } from '../../purchases/purchase.model';
import { PurchasesService } from '../../purchases/purchases.service';
import { ProvidersService } from '../providers.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-credit-providers',
    standalone: true,
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './credit-providers.component.html',
    styleUrls: ['./credit-providers.component.sass']
})
export class CreditProvidersComponent {

    constructor(
        private readonly providersService: ProvidersService,
        private readonly purchasesService: PurchasesService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
    ) { }

    displayedColumns: string[] = ['createdAt', 'serial', 'charge', 'remaining', 'actions']
    dataSource: PurchaseModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
    charge: number = 0
    private providerId: string = ''

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setMenu([
            { id: 'print_customer_credits', label: 'Imprimir cuenta', icon: 'printer', show: false },
            { id: 'export_customer_credits', label: 'Exportar cuenta PDF', icon: 'file_download', show: false },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.providerId = this.activatedRoute.snapshot.params['providerId']
        this.providersService.getProviderById(this.providerId).subscribe(provider => {
            this.navigationService.setTitle(`Creditos ${provider.name}`)
        })
        this.fetchData()
    }

    handlePageEvent(event: PageEvent): void {
        const { pageIndex, pageSize } = event
        this.pageIndex = pageIndex
        this.pageSize = pageSize
        this.fetchData()
    }

    onOpenDetails(purchaseId: string) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.purchasesService.getCreditPurchasesByProvider(this.providerId).subscribe({
            next: purchases => {
                this.navigationService.loadBarFinish()
                this.dataSource = purchases
                this.charge = 0
                for (const purchase of purchases) {
                    this.charge += (purchase.charge - purchase.payed)
                }
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

}
