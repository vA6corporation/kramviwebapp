import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { ProviderModel } from '../../providers/provider.model'
import { UserModel } from '../../users/user.model'
import { PurchaseItemModel } from '../purchase-item.model'
import { PurchaseModel } from '../purchase.model'
import { PurchasesService } from '../purchases.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
    selector: 'app-dialog-detail-purchases',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './dialog-detail-purchases.component.html',
    styleUrls: ['./dialog-detail-purchases.component.sass']
})
export class DialogDetailPurchasesComponent {

    readonly purchaseId: number = inject(MAT_DIALOG_DATA)
    private readonly purchasesService = inject(PurchasesService)
    private readonly authService = inject(AuthService)
    private readonly dialogRef: MatDialogRef<DialogDetailPurchasesComponent> = inject(MatDialogRef)

    $purchase = signal<PurchaseModel | null>(null)
    $purchaseItems = signal<PurchaseItemModel[]>([])
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

        this.purchasesService.getPurchaseById(this.purchaseId).subscribe(purchase => {
            const { purchaseItems, user, provider } = purchase
            this.$purchase.set(purchase)
            this.$purchaseItems.set(purchaseItems)
            this.$provider.set(provider)
            this.$user.set(user)
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
