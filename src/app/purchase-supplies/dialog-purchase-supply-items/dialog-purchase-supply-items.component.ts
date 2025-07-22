import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CreatePurchaseSupplyItemModel } from '../create-purchase-supply-item.model';
import { PurchaseSuppliesService } from '../purchase-supplies.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-purchase-supply-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-purchase-supply-items.component.html',
    styleUrls: ['./dialog-purchase-supply-items.component.sass'],
})
export class DialogPurchaseSupplyItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogPurchaseSupplyItemsComponent>,
    ) { }

    purchaseItem: CreatePurchaseSupplyItemModel = this.purchaseSuppliesService.getPurchaseSupplyItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.purchaseItem.quantity, Validators.required],
        cost: [this.purchaseItem.cost, Validators.required],
        isBonus: this.purchaseItem.igvCode === '11' ? true : false,
    })
    setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    subTotal(): number {
        const { quantity } = this.formGroup.value
        return Number((this.purchaseItem.cost * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.purchaseItem.cost
        this.formGroup.get('quantity')?.patchValue(subTotal.toFixed(4))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, cost, isBonus } = this.formGroup.value
            this.purchaseItem.quantity = quantity
            this.purchaseItem.cost = cost
            if (isBonus) {
                this.purchaseItem.igvCode = '11'
            } else {
                this.purchaseItem.igvCode = this.purchaseItem.preIgvCode
            }
            this.purchaseSuppliesService.updatePurchaseSupplyItem(this.index, this.purchaseItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.purchaseSuppliesService.removePurchaseSupplyItem(this.index)
    }
}
