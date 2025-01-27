import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductModel } from '../../products/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogAddStockComponent } from '../dialog-add-stock/dialog-add-stock.component';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { NavigationService } from '../../navigation/navigation.service';
import { PurchasesService } from '../../purchases/purchases.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { Subscription } from 'rxjs';
import { CreatePurchaseItemModel } from '../../purchases/create-purchase-item.model';
import { IgvType } from '../../products/igv-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-dialog-create-purchase',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './dialog-create-purchase.component.html',
  styleUrl: './dialog-create-purchase.component.sass'
})
export class DialogCreatePurchaseComponent {

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
            paymentMethodId: ['', Validators.required],
            cost: [this.product.cost, Validators.required],
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
                    isCredit: false,
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
