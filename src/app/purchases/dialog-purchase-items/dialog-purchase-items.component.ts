import { Component, inject, signal } from '@angular/core'
import { formatDate } from '@angular/common'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../../offices/offices.service'
import { IgvCode } from '../../sales/igv-code.enum'
import { PriceListModel } from '../../products/price-list.model'
import { PriceType } from '../../products/price-type.enum'
import { ProductsService } from '../../products/products.service'
import { CreatePurchaseItemModel } from '../create-purchase-item.model'
import { PurchasesService } from '../purchases.service'

@Component({
    selector: 'app-dialog-purchase-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-purchase-items.component.html',
    styleUrls: ['./dialog-purchase-items.component.sass']
})
export class DialogPurchaseItemsComponent {

    private readonly index: number = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly authService = inject(AuthService)
    private readonly productsService = inject(ProductsService)
    private readonly purchasesService = inject(PurchasesService)
    private readonly officesService = inject(OfficesService)
    private readonly navigationService = inject(NavigationService)
    private readonly dialogRef: MatDialogRef<DialogPurchaseItemsComponent> = inject(MatDialogRef)

    formArray: FormArray = this.formBuilder.array([])
    $setting = signal<SettingModel>(new SettingModel())
    offices: OfficeModel[] = []
    office: OfficeModel = new OfficeModel()
    priceLists: PriceListModel[] = []
    purchaseItem: CreatePurchaseItemModel = this.purchasesService.getPurchaseItem(this.index)
    selectedIndex: number = 0
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        prices: this.formArray,
        price: [this.purchaseItem.price, Validators.required],
        quantity: [this.purchaseItem.quantity, Validators.required],
        cost: [this.purchaseItem.cost, Validators.required],
        isBonus: this.purchaseItem.igvCode === IgvCode.BONIFICACION ? true : false,
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
            this.$setting.set(auth.setting)
            this.office = auth.office
            switch (this.$setting().defaultPrice) {
                case PriceType.OFICINA:
                    this.formGroup.get('price')?.setValidators([])
                    this.formGroup.get('price')?.updateValueAndValidity()
                    this.handleOfficesByActivity$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
                        this.offices = offices
                        for (const office of this.offices) {
                            const price = this.purchaseItem.prices.find(e => e.officeId === office.id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${office.name}`,
                                price: [price?.price || this.purchaseItem.price, Validators.required],
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
                            const price = this.purchaseItem.prices.find(e => e.priceListId === priceList.id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${priceList.name}`,
                                price: [price?.price || this.purchaseItem.price, Validators.required],
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

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, cost, isBonus } = this.formGroup.value
            this.purchaseItem.quantity = quantity
            this.purchaseItem.cost = cost
            if (isBonus) {
                this.purchaseItem.igvCode = IgvCode.BONIFICACION
            } else {
                this.purchaseItem.igvCode = this.purchaseItem.preIgvCode
            }
            this.purchasesService.updatePurchaseItem(this.index, this.purchaseItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onSubmitPrices(): void {
        if (this.formGroup.valid) {
            const { prices, price } = this.formGroup.value
            this.isLoading = true
            this.dialogRef.disableClose = true
            this.productsService.updatePrices(this.purchaseItem.productId, prices, price).subscribe(() => {
                this.formGroup.patchValue({ price, prices })
                this.purchaseItem.price = price
                this.purchaseItem.prices = prices
                this.dialogRef.disableClose = false
                this.isLoading = false
                this.selectedIndex = 0
            })
        }
    }

    onDeletePurchaseItem(): void {
        this.purchasesService.removePurchaseItem(this.index)
        this.dialogRef.close()
    }

}
