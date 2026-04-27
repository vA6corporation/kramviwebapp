import { Component, inject, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { SalesService } from '../sales.service'
import { MaterialModule } from '../../material.module'
import { AuthService } from '../../auth/auth.service'
import { ProductsService } from '../../products/products.service'
import { CreateSaleItemModel } from '../create-sale-item.model'
import { PriceListModel } from '../../products/price-list.model'
import { SettingModel } from '../../settings/setting.model'
import { OfficeModel } from '../../offices/office.model'
import { PriceType } from '../../products/price-type.enum'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-dialog-sale-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-sale-items.component.html',
    styleUrls: ['./dialog-sale-items.component.sass']
})
export class DialogSaleItemsComponent {

    private readonly index: number = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly salesService = inject(SalesService)
    private readonly authService = inject(AuthService)
    private readonly productsService = inject(ProductsService)
    private readonly dialogRef: MatDialogRef<DialogSaleItemsComponent> = inject(MatDialogRef)

    priceListId: any = 0
    saleItem: CreateSaleItemModel = this.salesService.getSaleItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.saleItem.quantity, Validators.required],
        price: [this.saleItem.price, Validators.required],
        observation: this.saleItem.observation,
        isBonus: this.saleItem.igvCode === '11' ? true : false,
    })

    $priceLists = signal<PriceListModel[]>([])
    $setting = signal<SettingModel>(new SettingModel())
    private office: OfficeModel = new OfficeModel()

    private handlePriceLists$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handlePriceLists$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.$priceLists.set(priceLists)
            this.priceListId = this.$setting().defaultPriceListId || priceLists[0]?.id
            for (const price of this.saleItem.prices || []) {
                if (price.price === this.saleItem.price && price.priceListId) {
                    this.priceListId = price.priceListId
                }
            }
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
            this.office = auth.office
        })
    }

    onChangePriceList() {
        //switch (this.setting.defaultPrice) {
        //    case PriceType.LISTA: {
        //        const price = this.saleItem.prices.find(e => e.priceListId === this.priceListId) || null
        //        if (price) {
        //            this.formGroup.get('price')?.patchValue(price.price)
        //        }
        //        break
        //    }
        //}
    }

    subTotal(): number {
        const { quantity } = this.formGroup.value
        return Number((this.saleItem.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.saleItem.price
        this.formGroup.get('quantity')?.patchValue(Number(subTotal.toFixed(4)))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, price, observation, isBonus } = this.formGroup.value
            this.saleItem.quantity = quantity
            this.saleItem.price = price
            this.saleItem.observation = observation
            if (isBonus) {
                this.saleItem.igvCode = IgvCode.BONIFICACION
            } else if (this.saleItem.igvCode !== IgvCode.BONIFICACION) {
                this.saleItem.igvCode = this.saleItem.preIgvCode
            } else {
                this.saleItem.igvCode = IgvCode.GRAVADO
            }
            this.salesService.updateSaleItem(this.index, this.saleItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.salesService.removeSaleItem(this.index)
    }
}
