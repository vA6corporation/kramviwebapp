import { Component, inject, signal } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { PurchaseOrderItemModel } from '../purchase-order-item.model'
import { PurchaseOrdersService } from '../purchase-orders.service'
import { IgvCode } from '../../sales/igv-code.enum'
import { ProductsService } from '../../products/products.service'
import { OfficesService } from '../../offices/offices.service'
import { OfficeModel } from '../../offices/office.model'
import { PriceType } from '../../products/price-type.enum'
import { PriceListModel } from '../../products/price-list.model'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-purchase-order-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-purchase-order-items.component.html',
    styleUrls: ['./dialog-purchase-order-items.component.sass']
})
export class DialogPurchaseOrderItemsComponent {

    private readonly index: number = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly authService = inject(AuthService)
    private readonly productsService = inject(ProductsService)
    private readonly purchaseOrdersService = inject(PurchaseOrdersService)
    private readonly dialogRef: MatDialogRef<DialogPurchaseOrderItemsComponent> = inject(MatDialogRef)
    private readonly officesService = inject(OfficesService)

    formArray: FormArray = this.formBuilder.array([])
    setting = new SettingModel()
    offices: OfficeModel[] = []
    office: OfficeModel = new OfficeModel()
    priceLists: PriceListModel[] = []
    purchaseOrderItem: PurchaseOrderItemModel = this.purchaseOrdersService.getPurchaseOrderItem(this.index)
    selectedIndex: number = 0
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        prices: this.formArray,
        price: [this.purchaseOrderItem.price, Validators.required],
        quantity: [this.purchaseOrderItem.quantity, Validators.required],
        cost: [this.purchaseOrderItem.cost, Validators.required],
        isBonus: this.purchaseOrderItem.igvCode === IgvCode.BONIFICACION ? true : false,
        observation: this.purchaseOrderItem.observation
    })

    private handleAuth$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleOfficesByActivity$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleOfficesByActivity$.unsubscribe()
    }
    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office

            switch (this.setting.defaultPrice) {
                case PriceType.OFICINA:
                    this.formGroup.get('price')?.setValidators([])
                    this.formGroup.get('price')?.updateValueAndValidity()
                    this.handleOfficesByActivity$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
                        this.offices = offices
                        for (const office of this.offices) {
                            const price = this.purchaseOrderItem.prices.find(e => e.officeId === office.id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${office.name}`,
                                price: [price?.price || this.purchaseOrderItem.price, Validators.required],
                                priceListId: null,
                                officeId: office.id,
                            })
                            this.formArray.push(formGroup)
                        }
                    })
                    break
                case PriceType.LISTA:
                    this.formGroup.get('price')?.setValidators([])
                    this.formGroup.get('price')?.updateValueAndValidity()
                    this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                        this.priceLists = priceLists
                        for (const priceList of this.priceLists) {
                            const price = this.purchaseOrderItem.prices.find(e => e.priceListId === priceList.id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${priceList.name}`,
                                price: [price?.price || this.purchaseOrderItem.price, Validators.required],
                                priceListId: priceList.id,
                                officeId: this.office.id,
                            })
                            this.formArray.push(formGroup)
                        }
                    })
                    break
            }
        })
    }

    subTotal(): number {
        const { quantity } = this.formGroup.value
        return Number((this.purchaseOrderItem.cost * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.purchaseOrderItem.cost
        this.formGroup.get('quantity')?.patchValue(Number(subTotal.toFixed(4)))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, cost, isBonus, observation } = this.formGroup.value
            this.purchaseOrderItem.quantity = quantity
            this.purchaseOrderItem.cost = cost
            this.purchaseOrderItem.observation = observation
            if (isBonus) {
                this.purchaseOrderItem.igvCode = IgvCode.BONIFICACION
            } else if (this.purchaseOrderItem.igvCode !== IgvCode.BONIFICACION) {
                this.purchaseOrderItem.igvCode = this.purchaseOrderItem.preIgvCode
            } else {
                this.purchaseOrderItem.igvCode = IgvCode.GRAVADO
            }
            this.purchaseOrdersService.updatePurchaseOrderItem(this.index, this.purchaseOrderItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onSubmitPrices(): void {
        if (this.formGroup.valid) {
            const { prices, price } = this.formGroup.value
            this.isLoading = true
            this.dialogRef.disableClose = true
            this.productsService.updatePrices(this.purchaseOrderItem.productId, prices, price).subscribe(() => {
                this.formGroup.patchValue({ price, prices })
                this.purchaseOrderItem.price = price
                this.purchaseOrderItem.prices = prices
                this.dialogRef.disableClose = false
                this.isLoading = false
                this.selectedIndex = 0
            })
        }
    }

    onDeletePurchaseOrderItem(): void {
        this.dialogRef.close()
        this.purchaseOrdersService.removePurchaseOrderItem(this.index)
    }

}
