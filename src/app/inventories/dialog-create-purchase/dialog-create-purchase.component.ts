import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ProductModel } from '../../products/product.model'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { DialogAddStockComponent } from '../dialog-add-stock/dialog-add-stock.component'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { NavigationService } from '../../navigation/navigation.service'
import { PurchasesService } from '../../purchases/purchases.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { Subscription } from 'rxjs'
import { CreatePurchaseItemModel } from '../../purchases/create-purchase-item.model'
import { IgvCode } from '../../sales/igv-code.enum'
import { HttpErrorResponse } from '@angular/common/http'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-create-purchase',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-purchase.component.html',
    styleUrl: './dialog-create-purchase.component.sass'
})
export class DialogCreatePurchaseComponent {

    private readonly product: ProductModel = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly dialogRef = inject(MatDialogRef)
    private readonly navigationService = inject(NavigationService)
    private readonly purchasesService = inject(PurchasesService)

    formGroup: FormGroup = this.formBuilder.group({
        quantity: ['', Validators.required],
        cost: [this.product.cost, Validators.required],
        createdAt: new Date(),
        observation: ''
    })
    $isLoading = signal<boolean>(false)
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    onSubmit() {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.dialogRef.disableClose = true
            this.navigationService.loadBarStart()
            const { cost, quantity, createdAt, observation } = this.formGroup.value
            const purchase = {
                invoiceCode: '00',
                observation,
                createdAt,
                providerId: null,
                serie: '',
                expirationAt: null
            }
            const purchaseItem: CreatePurchaseItemModel = {
                fullName: this.product.fullName,
                productId: this.product.id,
                cost,
                price: this.product.price,
                quantity,
                prices: this.product.prices,
                igvCode: IgvCode.GRAVADO,
                unitCode: this.product.unitCode,
                isTrackStock: this.product.isTrackStock,
                preIgvCode: this.product.igvCode,
            }
            this.purchasesService.create(purchase, [purchaseItem], {}).subscribe({
                next: () => {
                    this.dialogRef.disableClose = false
                    this.navigationService.loadBarFinish()
                    this.dialogRef.close(true)
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.dialogRef.disableClose = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                    this.$isLoading.set(false)
                }
            })
        }
    }

}
