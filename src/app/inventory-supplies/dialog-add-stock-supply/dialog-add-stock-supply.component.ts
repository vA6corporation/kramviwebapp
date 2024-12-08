import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { InventorySuppliesService } from '../inventory-supplies.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-add-stock-supply',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-add-stock-supply.component.html',
    styleUrls: ['./dialog-add-stock-supply.component.sass']
})
export class DialogAddStockSupplyComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly supplyId: string,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogAddStockSupplyComponent>,
        private readonly navigationService: NavigationService,
        private readonly inventorySuppliesService: InventorySuppliesService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: ['', Validators.required],
        cost: ['', Validators.required],
    })
    isLoading: boolean = false

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.dialogRef.disableClose = true
            this.navigationService.loadBarStart()
            const { cost, quantity } = this.formGroup.value
            const purchase = {
                invoiceCode: '03',
                purchasedAt: new Date(),
            }
            const purchaseSupplyItem = {
                supplyId: this.supplyId,
                quantity,
                cost,
                igvCode: '10',
                unitCode: 'NIU'
            }
            this.inventorySuppliesService.addStock(purchase, [purchaseSupplyItem]).subscribe({
                next: () => {
                    this.dialogRef.disableClose = false
                    this.navigationService.loadBarFinish()
                    this.dialogRef.close(quantity)
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
