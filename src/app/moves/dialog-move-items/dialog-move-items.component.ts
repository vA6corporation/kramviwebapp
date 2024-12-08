import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovesService } from '../moves.service';
import { CreateMoveItemModel } from '../create-move-item.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-move-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-move-items.component.html',
    styleUrls: ['./dialog-move-items.component.sass'],
})
export class DialogMoveItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly movesService: MovesService,
        private readonly dialogRef: MatDialogRef<DialogMoveItemsComponent>,
    ) { }

    moveItem: CreateMoveItemModel = this.movesService.getMoveItem(this.index);
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.moveItem.quantity, Validators.required],
    })

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity } = this.formGroup.value
            this.moveItem.quantity = quantity
            this.movesService.updateMoveItem(this.index, this.moveItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.movesService.removePurchaseItem(this.index)
    }

}
