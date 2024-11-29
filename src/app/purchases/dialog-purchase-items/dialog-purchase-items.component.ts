import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { OfficesService } from '../../offices/offices.service';
import { IgvType } from '../../products/igv-type.enum';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductsService } from '../../products/products.service';
import { CreatePurchaseItemModel } from '../create-purchase-item.model';
import { PurchasesService } from '../purchases.service';
import { formatDate } from '@angular/common';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-purchase-items',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-purchase-items.component.html',
    styleUrls: ['./dialog-purchase-items.component.sass']
})
export class DialogPurchaseItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly productsService: ProductsService,
        private readonly purchasesService: PurchasesService,
        private readonly officesService: OfficesService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogPurchaseItemsComponent>,
    ) { }

    formArray: FormArray = this.formBuilder.array([])
    setting = new SettingModel()
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
        isBonus: this.purchaseItem.igvCode === IgvType.BONIFICACION ? true : false,
    })

    formLot: FormGroup = this.formBuilder.group({
        lotNumber: ['', Validators.required],
        expirationAt: ['', Validators.required],
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
                            const price = this.purchaseItem.prices.find(e => e.officeId === office._id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${office.name}`,
                                price: [price?.price || this.purchaseItem.price, Validators.required],
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
                            const price = this.purchaseItem.prices.find(e => e.priceListId === priceList._id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${priceList.name}`,
                                price: [price?.price || this.purchaseItem.price, Validators.required],
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
                            const price = this.purchaseItem.prices.find(e => e.priceListId === priceList._id && e.officeId === this.office._id)
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${priceList.name}`,
                                price: [price?.price || this.purchaseItem.price, Validators.required],
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

    onGenerateLotNumber() {
        const { expirationAt } = this.formLot.value
        if (expirationAt) {
            const dateString = formatDate(new Date(expirationAt), 'ddMMyyyy', 'en-US')
            this.formLot.patchValue({ lotNumber: 'LO' + dateString })
        } else {
            this.navigationService.showMessage('Seleccione una fecha de vencimiento')
        }
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, cost, isBonus } = this.formGroup.value
            this.purchaseItem.quantity = quantity
            this.purchaseItem.cost = cost
            if (isBonus) {
                this.purchaseItem.igvCode = IgvType.BONIFICACION
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
            this.productsService.updatePrices(this.purchaseItem.productId, this.setting.defaultPrice, prices, price).subscribe(() => {
                this.formGroup.patchValue({ price, prices })
                this.purchaseItem.price = price
                this.purchaseItem.prices = prices
                this.dialogRef.disableClose = false
                this.isLoading = false
                this.selectedIndex = 0
            })
        }
    }

    onSubmitLot() {
        if (this.formLot.valid) {
            this.purchaseItem.lot = this.formLot.value
            this.selectedIndex = 0
        }
    }

    onDeletePurchaseItem(): void {
        this.purchasesService.removePurchaseItem(this.index)
        this.dialogRef.close()
    }

}
