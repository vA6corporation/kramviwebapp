import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductsService } from '../../products/products.service';
import { ProformaItemModel } from '../proforma-item.model';
import { ProformasService } from '../proformas.service';
import { IgvType } from '../../products/igv-type.enum';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-proforma-items',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-proforma-items.component.html',
    styleUrls: ['./dialog-proforma-items.component.sass']
})
export class DialogProformaItemsComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly proformasService: ProformasService,
        private readonly authService: AuthService,
        private readonly productsService: ProductsService,
        private readonly dialogRef: MatDialogRef<DialogProformaItemsComponent>,
    ) { }

    priceListId: string = ''
    proformaItem: ProformaItemModel = this.proformasService.getProformaItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.proformaItem.quantity, Validators.required],
        price: [this.proformaItem.price, Validators.required],
        observations: this.proformaItem.observations,
        isBonus: this.proformaItem.igvCode === IgvType.BONIFICACION ? true : false,
    })

    priceLists: PriceListModel[] = []
    setting: SettingModel = new SettingModel()
    private office: OfficeModel = new OfficeModel()

    private handlePriceLists$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePriceLists$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
            this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
            for (const price of this.proformaItem.prices || []) {
                if (price.price === this.proformaItem.price && price.priceListId) {
                    this.priceListId = price.priceListId
                }
            }
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    onChangePriceList() {
        switch (this.setting.defaultPrice) {
            case PriceType.LISTA: {
                const price = this.proformaItem.prices.find(e => e.priceListId === this.priceListId) || null
                if (price) {
                    this.formGroup.get('price')?.patchValue(price.price)
                }
                break
            }
            case PriceType.LISTAOFICINA: {
                const price = this.proformaItem.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                if (price) {
                    this.formGroup.get('price')?.patchValue(price.price)
                }
                break
            }
        }
    }

    subTotal(): number {
        const { quantity } = this.formGroup.value
        return Number((this.proformaItem.price * quantity).toFixed(2))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.proformaItem.price
        this.formGroup.get('quantity')?.patchValue(Number(subTotal.toFixed(4)))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, price, observations, isBonus } = this.formGroup.value
            this.proformaItem.quantity = quantity
            this.proformaItem.price = price
            this.proformaItem.observations = observations
            if (isBonus) {
                this.proformaItem.igvCode = IgvType.BONIFICACION
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
