import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { NavigationService } from '../../navigation/navigation.service'
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component'
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component'
import { ProviderModel } from '../../providers/provider.model'
import { PurchaseOrderItemModel } from '../purchase-order-item.model'
import { PurchaseOrderModel } from '../purchase-order.model'
import { PurchaseOrdersService } from '../purchase-orders.service'
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { PurchaseOrderItemsComponent } from '../purchase-order-items/purchase-order-items.component'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-charge-edit-purchase-orders',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, PurchaseOrderItemsComponent],
    templateUrl: './charge-edit-purchase-orders.component.html',
    styleUrls: ['./charge-edit-purchase-orders.component.sass']
})
export class ChargeEditPurchaseOrdersComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly purchaseOrdersService = inject(PurchaseOrdersService)
    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)

    formGroup: FormGroup = this.formBuilder.group({
        observation: '',
    })
    purchaseOrderItems: PurchaseOrderItemModel[] = []
    $charge = signal<number>(0)
    $provider = signal<ProviderModel | null>(null)
    $isLoading = signal<boolean>(false)

    private purchaseOrderId: any = ''

    private handleClickMenu$: Subscription = new Subscription()
    private handlePurchaseOrderItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePurchaseOrderItems$.unsubscribe()
    }

    ngOnInit(): void {
        const purchaseOrder = this.purchaseOrdersService.getPurchaseOrder()
        if (purchaseOrder === null) {
            this.router.navigate(['/purchaseOrders'])
        } else {
            this.navigationService.setTitle('Comprar')
            this.purchaseOrderId = purchaseOrder.id
            this.$provider.set(purchaseOrder.provider)
            this.formGroup.patchValue(purchaseOrder)

            this.navigationService.setMenu([
                // { id: 'split_payment', label: 'Dividir pago', icon: 'checklist_rtl', show: true },
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
                            this.$provider.set(provider)
                        }
                    })

                    dialogRef.componentInstance.handleAddProvider().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateProvidersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(provider => {
                            if (provider) {
                                this.$provider.set(provider)
                            }
                        })
                    })
                    break
                    default:
                        break
                }
            })

            this.handlePurchaseOrderItems$ = this.purchaseOrdersService.handlePurchaseOrderItems().subscribe(purchaseOrderItems => {
                this.purchaseOrderItems = purchaseOrderItems
                this.$charge.set(0)
                let charge = 0

                for (const purchaseOrderItem of this.purchaseOrderItems) {
                    if (purchaseOrderItem.igvCode !== IgvCode.BONIFICACION) {
                        charge += purchaseOrderItem.cost * purchaseOrderItem.quantity
                    }
                }

                this.$charge.set(charge)
            })
        }
    }

    onSubmit() {
        try {
            const provider = this.$provider()
            const formData = this.formGroup.value

            const purchaseOrder = {
                observation: formData.observation,
                providerId: provider ? provider.id : null,
            }

            if (this.purchaseOrderItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            this.purchaseOrdersService.updatePurchaseOrder(purchaseOrder, this.purchaseOrderItems, this.purchaseOrderId).subscribe({
                next: () => {
                    this.purchaseOrdersService.setPurchaseOrderItems([])
                    this.router.navigate(['/purchaseOrders'])
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.$isLoading.set(false)
            this.navigationService.loadBarFinish()
        }
    }

    onEditProvider() {
        const dialogRef = this.matDialog.open(DialogEditProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.$provider(),
        })

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.$provider.set(provider)
            }
        })
    }

}
