import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component';
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { CreatePurchaseSupplyItemModel } from '../create-purchase-supply-item.model';
import { CreatePurchaseSupplyModel } from '../create-purchase-supply.model';
import { PurchaseSuppliesService } from '../purchase-supplies.service';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';

interface FormData {
    invoiceCode: string,
    paymentMethodId: string,
    purchasedAt: Date,
    serie: string | null,
    observations: string,
}

@Component({
    selector: 'app-charge-purchase-supplies',
    templateUrl: './charge-purchase-supplies.component.html',
    styleUrls: ['./charge-purchase-supplies.component.sass']
})
export class ChargePurchaseSuppliesComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    purchaseSupplyItems: CreatePurchaseSupplyItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '02',
        paymentMethodId: null,
        purchasedAt: new Date(),
        serie: null,
        observations: '',
    })
    invoiceTypes = [
        { code: '01', name: 'FACTURA' },
        { code: '02', name: 'BOLETA' },
        { code: '03', name: 'NOTA DE VENTA' },
    ]

    private setting: SettingModel = new SettingModel()
    paymentMethods: PaymentMethodModel[] = []

    private handleClickMenu$: Subscription = new Subscription()
    private purchaseSupplyItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.purchaseSupplyItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Comprar')

        this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice)

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.purchaseSupplyItems$ = this.purchaseSuppliesService.getPurchaseSupplyItems().subscribe(purchaseSupplyItems => {
            this.purchaseSupplyItems = purchaseSupplyItems
            this.charge = 0
            for (const purchaseSupplyItem of this.purchaseSupplyItems) {
                if (purchaseSupplyItem.igvCode !== '11') {
                    this.charge += purchaseSupplyItem.cost * purchaseSupplyItem.quantity
                }
            }
        })

        this.navigationService.setMenu([
            { id: 'add_provider', label: 'Agregar proveedor', icon: 'person_add', show: true },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_provider':
                    const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(provider => {
                        if (provider) {
                            this.provider = provider
                        }
                    })

                    dialogRef.componentInstance.handleAddProvider().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateProvidersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(provider => {
                            if (provider) {
                                this.provider = provider
                            }
                        })
                    })
                    break
                default:
                    break
            }
        })
    }

    onSubmit() {
        try {
            const formData: FormData = this.formGroup.value
            const purchaseSupply: CreatePurchaseSupplyModel = {
                invoiceCode: formData.invoiceCode,
                paymentType: formData.paymentMethodId,
                serie: formData.serie,
                purchasedAt: formData.purchasedAt,
                observations: formData.observations,
                providerId: this.provider?._id || null,
            }

            if (this.purchaseSupplyItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            if (purchaseSupply.invoiceCode === '01' && this.provider === null) {
                throw new Error('Agrega un provedor')
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.purchaseSuppliesService.savePurchaseSupply(purchaseSupply, this.purchaseSupplyItems).subscribe(purchaseSupply => {
                this.purchaseSuppliesService.setPurchaseSupplyItems([])
                this.router.navigate(['/purchaseSupplies'])
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Registrado correctamente')
            }, (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
                this.isLoading = false
                this.navigationService.loadBarFinish()
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.isLoading = false
            this.navigationService.loadBarFinish()
        }
    }

    onEditProvider() {
        this.matDialog.open(DialogEditProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.provider,
        })
    }

}
