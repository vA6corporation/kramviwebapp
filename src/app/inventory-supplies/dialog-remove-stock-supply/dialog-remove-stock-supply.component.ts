import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { InventorySuppliesService } from '../inventory-supplies.service';

@Component({
    selector: 'app-dialog-remove-stock-supply',
    templateUrl: './dialog-remove-stock-supply.component.html',
    styleUrls: ['./dialog-remove-stock-supply.component.sass']
})
export class DialogRemoveStockSupplyComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly supplyId: string,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogRemoveStockSupplyComponent>,
        private readonly navigationService: NavigationService,
        private readonly inventorySuppliesService: InventorySuppliesService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: ['', Validators.required],
        incidentType: ['', Validators.required],
        observations: '',
    })
    isLoading: boolean = false
    incidentTypes = [
        'DIVISION',
        'VENCIMIENTO',
        'DESTRUCCION',
        'EXTRAVIO',
        'DEVOLUCION',
        'CONSUMO',
        'OTROS',
    ]

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.dialogRef.disableClose = true
            this.isLoading = true
            const { quantity, incidentType, observations } = this.formGroup.value
            const incidentSupply = {
                incidentType,
                observations,
            }
            const incidentSupplyItem = {
                supplyId: this.supplyId,
                quantity,
                cost: 0,
                igvCode: '10',
                unitCode: 'NIU'
            }
            this.inventorySuppliesService.removeStock(incidentSupply, [incidentSupplyItem]).subscribe({
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
