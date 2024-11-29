import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { CreateDueModel } from '../../dues/create-due.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogCreatePaymentPurchasesComponent } from '../../payment-purchases/dialog-create-payment-purchases/dialog-create-payment-purchases.component';
import { PaymentPurchaseModel } from '../../payment-purchases/payment-purchase.model';
import { PaymentPurchasesService } from '../../payment-purchases/payment-purchases.service';
import { ProviderModel } from '../../providers/provider.model';
import { TurnModel } from '../../turns/turn.model';
import { PurchaseItemModel } from '../purchase-item.model';
import { PurchaseModel } from '../purchase.model';
import { PurchasesService } from '../purchases.service';
import { DialogEditPaymentPurchasesComponent } from '../../payment-purchases/dialog-edit-payment-purchases/dialog-edit-payment-purchases.component';

@Component({
    selector: 'app-detail-purchases',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './detail-purchases.component.html',
    styleUrl: './detail-purchases.component.sass'
})
export class DetailPurchasesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly purchasesService: PurchasesService,
        private readonly paymentPurchasesService: PaymentPurchasesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
    ) { }

    purchase: PurchaseModel | null = null
    paymentPurchases: PaymentPurchaseModel[] = []
    provider: ProviderModel | null = null
    turn: TurnModel | null = null
    purchaseItems: PurchaseItemModel[] = []
    office: OfficeModel = new OfficeModel()
    setting: SettingModel = new SettingModel()
    dues: CreateDueModel[] = []
    private purchaseId: string = ''

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

    onDeletePaymentPurchase(paymentPurchaseId: string, purchaseId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.paymentPurchasesService.delete(paymentPurchaseId, purchaseId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Eliminado correctamente')
                    this.fetchData()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        }
    }

    onEditPaymentPurchase(paymentPurchase: PaymentPurchaseModel) {
        const dialogRef = this.matDialog.open(DialogEditPaymentPurchasesComponent, {
            data: paymentPurchase,
            width: '600px',
            position: { top: '20px' }
        })

        dialogRef.afterClosed().subscribe(updatePayment => {
            if (updatePayment) {
                this.navigationService.loadBarStart()
                this.paymentPurchasesService.update(updatePayment, paymentPurchase._id, paymentPurchase.purchaseId).subscribe({
                    next: () => {
                        Object.assign(paymentPurchase, updatePayment)
                        this.navigationService.showMessage('Se han guardado los cambios')
                        this.navigationService.loadBarFinish()
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                        this.navigationService.loadBarFinish()
                    }
                })
            }
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseById(this.purchaseId).subscribe(purchase => {
            this.navigationService.loadBarFinish()
            this.navigationService.setTitle(`Pagos`)
            this.purchase = purchase
            this.paymentPurchases = purchase.paymentPurchases
            this.provider = purchase.provider
            this.purchaseItems = purchase.purchaseItems
            this.purchasesService.setPurchaseItems(this.purchaseItems)
        })
    }

    onCreatePaymentPurchase() {
        if (this.purchase) {
            const dialogRef = this.matDialog.open(DialogCreatePaymentPurchasesComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.purchaseId,
            })

            dialogRef.afterClosed().subscribe(paymentPurchase => {
                if (paymentPurchase) {
                    this.navigationService.loadBarStart()
                    this.paymentPurchasesService.create(paymentPurchase, this.purchaseId).subscribe({
                        next: () => {
                            this.navigationService.showMessage('Registrado correctamente')
                            this.navigationService.loadBarFinish()
                            this.fetchData()
                        }, error: (error: HttpErrorResponse) => {
                            this.navigationService.loadBarFinish()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
            })
        }
    }

}
