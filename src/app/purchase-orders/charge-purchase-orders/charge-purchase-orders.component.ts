import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component';
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { PurchaseOrderItemModel } from '../purchase-order-item.model';
import { PurchaseOrdersService } from '../purchase-orders.service';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';
import { MaterialModule } from '../../material.module';
import { PurchaseOrderItemsComponent } from '../purchase-order-items/purchase-order-items.component';

@Component({
    selector: 'app-charge-purchase-orders',
    imports: [MaterialModule, ReactiveFormsModule, PurchaseOrderItemsComponent],
    templateUrl: './charge-purchase-orders.component.html',
    styleUrls: ['./charge-purchase-orders.component.sass']
})
export class ChargePurchaseOrdersComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        observations: '',
    })
    purchaseOrderItems: PurchaseOrderItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false

    private handleClickMenu$: Subscription = new Subscription()
    private purchaseOrderItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.purchaseOrderItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Guardar')

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

        this.purchaseOrderItems$ = this.purchaseOrdersService.getPurchaseOrderItems().subscribe(purchaseOrderItems => {
            this.purchaseOrderItems = purchaseOrderItems
            this.charge = 0
            for (const purchaseOrderItem of this.purchaseOrderItems) {
                if (purchaseOrderItem.igvCode !== '11') {
                    this.charge += purchaseOrderItem.cost * purchaseOrderItem.quantity
                }
            }
        })
    }

    onSubmit() {
        try {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const formData = this.formGroup.value
            const purchaseOrder = {
                observations: formData.observations,
                providerId: this.provider?._id || null,
            }

            if (this.purchaseOrderItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            this.purchaseOrdersService.createPurchaseOrder(purchaseOrder, this.purchaseOrderItems).subscribe({
                next: () => {
                    this.purchaseOrdersService.setPurchaseOrderItems([])
                    this.router.navigate(['/purchaseOrders'])
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
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
