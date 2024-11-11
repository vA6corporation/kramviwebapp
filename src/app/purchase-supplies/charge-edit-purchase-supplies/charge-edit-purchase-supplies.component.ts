import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
    paymentType: string,
    purchasedAt: Date,
    createdAt: Date,
    serie: string,
    observations: string,
}

@Component({
    selector: 'app-charge-edit-purchase-supplies',
    templateUrl: './charge-edit-purchase-supplies.component.html',
    styleUrls: ['./charge-edit-purchase-supplies.component.sass']
})
export class ChargeEditPurchaseSuppliesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    private handleClickMenu$: Subscription = new Subscription()
    private purchaseSupplyItems$: Subscription = new Subscription()

    purchaseSupplyItems: CreatePurchaseSupplyItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '03',
        paymentType: 'EFECTIVO',
        purchasedAt: new Date(),
        createdAt: new Date(),
        serie: '',
        observations: '',
    } as FormData)
    invoiceTypes = [
        { code: '01', name: 'FACTURA' },
        { code: '02', name: 'BOLETA' },
        { code: '03', name: 'NOTA DE VENTA' },
    ]

    private purchaseSupplyId: string = ''
    paymentMethods: PaymentMethodModel[] = []

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.purchaseSupplyItems$.unsubscribe()
    }

    ngOnInit(): void {
        const purchaseSupply = this.purchaseSuppliesService.getPurchaseSupply()
        this.navigationService.setTitle('Comprar')

        if (purchaseSupply === null) {
            this.router.navigate(['purchaseSupplies'])
        } else {

            this.purchaseSupplyId = purchaseSupply._id
            this.purchaseSuppliesService.setProvider(purchaseSupply.provider)

            this.formGroup.patchValue(purchaseSupply)

            this.purchaseSupplyItems$ = this.purchaseSuppliesService.getPurchaseSupplyItems().subscribe(purchaseSupplyItems => {
                this.purchaseSupplyItems = purchaseSupplyItems
                this.charge = 0
                for (const purchaseSupplyItem of this.purchaseSupplyItems) {
                    if (purchaseSupplyItem.igvCode !== '11') {
                        this.charge += purchaseSupplyItem.cost * purchaseSupplyItem.quantity
                    }
                }
            })

            this.purchaseSuppliesService.getProvider().subscribe(provider => {
                this.provider = provider
            })

            this.purchaseSuppliesService.setProvider(purchaseSupply.provider)

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
    }

    onSubmit() {
        try {

            this.isLoading = true
            this.navigationService.loadBarStart()
            const formData: FormData = this.formGroup.value
            const purchaseSupply: CreatePurchaseSupplyModel = {
                invoiceCode: formData.invoiceCode,
                paymentType: formData.paymentType,
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

            this.purchaseSuppliesService.update(purchaseSupply, this.purchaseSupplyItems, this.purchaseSupplyId).subscribe({
                next: () => {
                    this.purchaseSuppliesService.setPurchaseSupplyItems([])
                    this.router.navigate(['/purchaseSupplies'])
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                }
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
