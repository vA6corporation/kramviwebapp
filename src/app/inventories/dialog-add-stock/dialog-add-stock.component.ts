import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { IgvType } from '../../products/igv-type.enum';
import { ProductModel } from '../../products/product.model';
import { CreatePurchaseItemModel } from '../../purchases/create-purchase-item.model';
import { PurchasesService } from '../../purchases/purchases.service';

@Component({
    selector: 'app-dialog-add-stock',
    templateUrl: './dialog-add-stock.component.html',
    styleUrls: ['./dialog-add-stock.component.sass']
})
export class DialogAddStockComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly product: ProductModel,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogAddStockComponent>,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly navigationService: NavigationService,
        private readonly purchasesService: PurchasesService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: ['', Validators.required],
        paymentMethodId: '',
        cost: this.product.cost,
        purchasedAt: new Date(),
        observations: ''
    })
    isLoading: boolean = false
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id })
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.dialogRef.disableClose = true
            this.navigationService.loadBarStart()
            const { cost, quantity, paymentMethodId, purchasedAt, observations } = this.formGroup.value
            const purchase = {
                invoiceType: 'NOTA DE VENTA',
                observations,
                paymentMethodId,
                purchasedAt,
                providerId: null,
                serie: null,
                expirationAt: null
            }
            const purchaseItem: CreatePurchaseItemModel = {
                fullName: this.product.fullName,
                productId: this.product._id,
                quantity,
                cost,
                price: this.product.price,
                prices: this.product.prices,
                igvCode: IgvType.GRAVADO,
                unitCode: this.product.unitCode,
                isTrackStock: this.product.isTrackStock,
                preIgvCode: this.product.igvCode,
                lot: null
            }
            this.purchasesService.create(purchase, [purchaseItem], null).subscribe({
                next: () => {
                    this.dialogRef.disableClose = false
                    this.navigationService.loadBarFinish()
                    this.dialogRef.close(true)
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.dialogRef.disableClose = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                }
            })
        }
    }
}
