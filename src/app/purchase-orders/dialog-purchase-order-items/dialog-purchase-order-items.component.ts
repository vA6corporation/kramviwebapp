import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { PurchaseOrderItemModel } from '../purchase-order-item.model';
import { PurchaseOrdersService } from '../purchase-orders.service';
import { IgvType } from '../../products/igv-type.enum';
import { ProductsService } from '../../products/products.service';
import { OfficesService } from '../../offices/offices.service';
import { OfficeModel } from '../../auth/office.model';
import { PriceType } from '../../products/price-type.enum';
import { PriceListModel } from '../../products/price-list.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-purchase-order-items',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-purchase-order-items.component.html',
    styleUrls: ['./dialog-purchase-order-items.component.sass']
})
export class DialogPurchaseOrderItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly productsService: ProductsService,
        private readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly dialogRef: MatDialogRef<DialogPurchaseOrderItemsComponent>,
        private readonly officesService: OfficesService,
    ) { }

    formArray: FormArray = this.formBuilder.array([])
    setting = new SettingModel()
    offices: OfficeModel[] = []
    office: OfficeModel = new OfficeModel()
    priceLists: PriceListModel[] = []
    purchaseOrderItem: PurchaseOrderItemModel = this.purchaseOrdersService.getPurchaseOrderItem(this.index);
    selectedIndex: number = 0
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        prices: this.formArray,
        price: [this.purchaseOrderItem.price, Validators.required],
        quantity: [this.purchaseOrderItem.quantity, Validators.required],
        cost: [this.purchaseOrderItem.cost, Validators.required],
        isBonus: this.purchaseOrderItem.igvCode === IgvType.BONIFICACION ? true : false,
        observations: this.purchaseOrderItem.observations
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
                            const price = this.purchaseOrderItem.prices.find(e => e.officeId === office._id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${office.name}`,
                                price: [price?.price || this.purchaseOrderItem.price, Validators.required],
                                priceListId: null,
                                officeId: office._id,
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
                            const price = this.purchaseOrderItem.prices.find(e => e.priceListId === priceList._id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${priceList.name}`,
                                price: [price?.price || this.purchaseOrderItem.price, Validators.required],
                                priceListId: priceList._id,
                                officeId: this.office._id,
                            })
                            this.formArray.push(formGroup)
                        }
                    })
                    break
                case PriceType.LISTAOFICINA:
                    this.formGroup.get('price')?.setValidators([])
                    this.formGroup.get('price')?.updateValueAndValidity()
                    this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                        this.priceLists = priceLists
                        for (const priceList of this.priceLists) {
                            const price = this.purchaseOrderItem.prices.find(e => e.priceListId === priceList._id && e.officeId === this.office._id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${priceList.name}`,
                                price: [price?.price || this.purchaseOrderItem.price, Validators.required],
                                priceListId: priceList._id,
                                officeId: this.office._id,
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
        return Number((this.purchaseOrderItem.cost * quantity).toFixed(2))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.purchaseOrderItem.cost
        this.formGroup.get('quantity')?.patchValue(Number(subTotal.toFixed(4)))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, cost, isBonus, observations } = this.formGroup.value
            this.purchaseOrderItem.quantity = quantity
            this.purchaseOrderItem.cost = cost
            this.purchaseOrderItem.observations = observations
            if (isBonus) {
                this.purchaseOrderItem.igvCode = IgvType.BONIFICACION
            } else if (this.purchaseOrderItem.igvCode !== IgvType.BONIFICACION) {
                this.purchaseOrderItem.igvCode = this.purchaseOrderItem.preIgvCode
            } else {
                this.purchaseOrderItem.igvCode = IgvType.GRAVADO
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
            this.productsService.updatePrices(this.purchaseOrderItem.productId, this.setting.defaultPrice, prices, price).subscribe(() => {
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
