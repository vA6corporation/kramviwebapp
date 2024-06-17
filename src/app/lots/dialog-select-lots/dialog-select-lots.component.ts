import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { LotModel } from '../lot.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSelectionListChange } from '@angular/material/list';
import { ProductModel } from '../../products/product.model';
import { SalesService } from '../../sales/sales.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface DialogSelectLotsData {
    lots: LotModel[]
    product: ProductModel,
}

@Component({
    selector: 'app-dialog-select-lots',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-select-lots.component.html',
    styleUrl: './dialog-select-lots.component.sass'
})
export class DialogSelectLotsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly data: DialogSelectLotsData,
        private readonly salesService: SalesService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialogRef: MatDialogRef<DialogSelectLotsComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: [null, Validators.required]
    })
    lots: LotModel[] = []
    lot: LotModel | null = null

    ngOnInit() {
        this.lots = this.data.lots
    }

    onSelectionChange(event: MatSelectionListChange) {
        this.lot = event.options.filter(o => o.selected).map(o => o.value)[0]
    }

    onSubmit() {
        if (this.lot && this.formGroup.valid) {
            const { quantity } = this.formGroup.value
            this.salesService.addSaleItemWithLot(this.data.product, quantity, this.lot)
            this.matDialogRef.close()
        }
    }

}
