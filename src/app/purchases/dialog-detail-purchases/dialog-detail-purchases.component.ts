import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { PaymentPurchaseModel } from '../../payment-purchases/payment-purchase.model';
import { ProviderModel } from '../../providers/provider.model';
import { UserModel } from '../../users/user.model';
import { PurchaseItemModel } from '../purchase-item.model';
import { PurchaseModel } from '../purchase.model';
import { PurchasesService } from '../purchases.service';

@Component({
    selector: 'app-dialog-detail-purchases',
    templateUrl: './dialog-detail-purchases.component.html',
    styleUrls: ['./dialog-detail-purchases.component.sass']
})
export class DialogDetailPurchasesComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly purchaseId: string,
        private readonly purchasesService: PurchasesService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogDetailPurchasesComponent>
    ) { }

    purchase: PurchaseModel | null = null
    purchaseItems: PurchaseItemModel[] = []
    payments: PaymentPurchaseModel[] = []
    provider: ProviderModel | null = null
    office: OfficeModel | null = null
    user: UserModel | null = null

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.purchasesService.getPurchaseById(this.purchaseId).subscribe(purchase => {
            this.purchase = purchase
            const { purchaseItems, user, payments, provider } = purchase
            this.purchaseItems = purchaseItems
            this.payments = payments
            this.provider = provider
            this.user = user
        })
    }

    onDeletePurchase() {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.dialogRef.disableClose = true
            this.purchasesService.deletePurchase(this.purchaseId).subscribe(() => {
                this.dialogRef.close(true)
            })
        }
    }

}