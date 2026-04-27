import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { MaterialModule } from '../../material.module'
import { ProviderModel } from '../../providers/provider.model'
import { UserModel } from '../../users/user.model'
import { PurchaseOrderItemModel } from '../purchase-order-item.model'
import { PurchaseOrderModel } from '../purchase-order.model'
import { PurchaseOrdersService } from '../purchase-orders.service'

@Component({
    selector: 'app-dialog-detail-purchase-orders',
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './dialog-detail-purchase-orders.component.html',
    styleUrls: ['./dialog-detail-purchase-orders.component.sass']
})
export class DialogDetailPurchaseOrdersComponent {

    readonly purchaseOrderId: number = inject(MAT_DIALOG_DATA)
    private readonly purchaseOrdersService = inject(PurchaseOrdersService)
    private readonly authService = inject(AuthService)

    $purchaseOrder = signal<PurchaseOrderModel | null>(null)
    $purchaseOrderItems = signal<PurchaseOrderItemModel[]>([])
    $provider = signal<ProviderModel | null>(null)
    $office = signal<OfficeModel | null>(null)
    $user = signal<UserModel | null>(null)

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$office.set(auth.office)
        })

        this.purchaseOrdersService.getPurchaseOrderById(this.purchaseOrderId).subscribe(purchaseOrder => {
            const { purchaseOrderItems, user, provider } = purchaseOrder
            this.$purchaseOrder.set(purchaseOrder)
            this.$purchaseOrderItems.set(purchaseOrderItems)
            this.$provider.set(provider)
            this.$user.set(user)
        })
    }
}
