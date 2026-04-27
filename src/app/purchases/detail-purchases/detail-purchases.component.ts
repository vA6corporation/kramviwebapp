import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { OfficeModel } from '../../offices/office.model'
import { CreateDueModel } from '../../dues/create-due.model'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { ProviderModel } from '../../providers/provider.model'
import { TurnModel } from '../../turns/turn.model'
import { PurchaseItemModel } from '../purchase-item.model'
import { PurchaseModel } from '../purchase.model'
import { PurchasesService } from '../purchases.service'

@Component({
    selector: 'app-detail-purchases',
    imports: [MaterialModule, CommonModule],
    templateUrl: './detail-purchases.component.html',
    styleUrl: './detail-purchases.component.sass'
})
export class DetailPurchasesComponent {

    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly purchasesService = inject(PurchasesService)

    purchase: PurchaseModel | null = null
    provider: ProviderModel | null = null
    turn: TurnModel | null = null
    purchaseItems: PurchaseItemModel[] = []
    office: OfficeModel = new OfficeModel()
    dues: CreateDueModel[] = []
    private purchaseId: any = ''

    private handleOpenTurn$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleDues$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleOpenTurn$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleDues$.unsubscribe()
        this.purchasesService.setPurchaseItems([])
    }

    ngOnInit(): void {
        this.purchaseId = this.activatedRoute.snapshot.params['purchaseId']
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseById(this.purchaseId).subscribe(purchase => {
            this.navigationService.loadBarFinish()
            this.navigationService.setTitle(`Pagos`)
            this.purchase = purchase
            this.provider = purchase.provider
            this.purchaseItems = purchase.purchaseItems
            this.purchasesService.setPurchaseItems(this.purchaseItems)
        })
    }

}
