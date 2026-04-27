import { Component, inject, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { PriceListModel } from '../../products/price-list.model'
import { PriceType } from '../../products/price-type.enum'
import { ProductsService } from '../../products/products.service'
import { ProformaItemModel } from '../proforma-item.model'
import { ProformasService } from '../proformas.service'
import { IgvCode } from '../../sales/igv-code.enum'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-proforma-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-proforma-items.component.html',
    styleUrls: ['./dialog-proforma-items.component.sass']
})
export class DialogProformaItemsComponent {

    private readonly index: number = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly proformasService = inject(ProformasService)
    private readonly authService = inject(AuthService)
    private readonly productsService = inject(ProductsService)
    private readonly dialogRef: MatDialogRef<DialogProformaItemsComponent> = inject(MatDialogRef)

    priceListId: any = 0
    proformaItem: ProformaItemModel = this.proformasService.getProformaItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.proformaItem.quantity, Validators.required],
        price: [this.proformaItem.price, Validators.required],
        observation: this.proformaItem.observation,
        isBonus: this.proformaItem.igvCode === IgvCode.BONIFICACION ? true : false,
    })

    $priceLists = signal<PriceListModel[]>([])
    $setting = signal<SettingModel>(new SettingModel())
    private office: OfficeModel = new OfficeModel()

    private handlePriceLists$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePriceLists$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.$priceLists.set(priceLists)
            this.priceListId = this.$setting().defaultPriceListId || priceLists[0]?.id
            for (const price of this.proformaItem.prices || []) {
                if (price.price === this.proformaItem.price && price.priceListId) {
                    this.priceListId = price.priceListId
                }
            }
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
        })
    }

    onChangePriceList() {
        switch (this.$setting().defaultPrice) {
            case PriceType.LISTA: {
                const price = this.proformaItem.prices.find(e => e.priceListId === this.priceListId) || null
                if (price) {
                    this.formGroup.get('price')?.patchValue(price.price)
                }
                break
            }
        }
    }

    subTotal(): number {
        const { quantity } = this.formGroup.value
        return Number((this.proformaItem.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.proformaItem.price
        this.formGroup.get('quantity')?.patchValue(Number(subTotal.toFixed(4)))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, price, observation, isBonus } = this.formGroup.value
            this.proformaItem.quantity = quantity
            this.proformaItem.price = price
            this.proformaItem.observation = observation
            if (isBonus) {
                this.proformaItem.igvCode = IgvCode.BONIFICACION
            } else {
                this.proformaItem.igvCode = this.proformaItem.preIgvCode
            }
            this.proformasService.updateProformaItem(this.index, this.proformaItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.proformasService.removeProformaItem(this.index)
    }

}
