import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { MaterialModule } from '../../material.module';
import { ProviderModel } from '../../providers/provider.model';
import { UserModel } from '../../users/user.model';
import { PurchaseOrderItemModel } from '../purchase-order-item.model';
import { PurchaseOrderModel } from '../purchase-order.model';
import { PurchaseOrdersService } from '../purchase-orders.service';

@Component({
    selector: 'app-dialog-detail-purchase-orders',
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './dialog-detail-purchase-orders.component.html',
    styleUrls: ['./dialog-detail-purchase-orders.component.sass']
})
export class DialogDetailPurchaseOrdersComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly purchaseOrderId: string,
        readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly authService: AuthService,
    ) { }

    purchaseOrder: PurchaseOrderModel | null = null;
    purchaseOrderItems: PurchaseOrderItemModel[] = [];
    provider: ProviderModel | null = null;
    office: OfficeModel | null = null;
    user: UserModel | null = null;

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.purchaseOrdersService.getPurchaseOrderById(this.purchaseOrderId).subscribe(purchaseOrder => {
            this.purchaseOrder = purchaseOrder
            const { purchaseOrderItems, user, provider } = purchaseOrder
            this.purchaseOrderItems = purchaseOrderItems
            this.provider = provider
            this.user = user
        })
    }
}
