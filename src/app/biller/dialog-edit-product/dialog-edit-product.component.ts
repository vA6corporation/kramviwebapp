import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { BillItemModel } from '../bill-item.model';
import { BillsService } from '../bills.service';

@Component({
    selector: 'app-dialog-edit-product',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-product.component.html',
    styleUrls: ['./dialog-edit-product.component.sass']
})
export class DialogEditProductComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly billsService: BillsService,
        private readonly dialogRef: MatDialogRef<DialogEditProductComponent>,
    ) { }

    billItem: BillItemModel = this.billsService.getBillItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        fullName: [this.billItem.fullName, Validators.required],
        price: [this.billItem.price, Validators.required],
        quantity: [this.billItem.quantity, Validators.required],
        igvCode: this.billItem.igvCode,
    })

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const billItem: BillItemModel = this.formGroup.value
            this.billsService.updateBillItem(billItem, this.index)
            this.dialogRef.close()
        }
    }

    onDelete(): void {
        this.billsService.removeBillItem(this.index)
    }

}
