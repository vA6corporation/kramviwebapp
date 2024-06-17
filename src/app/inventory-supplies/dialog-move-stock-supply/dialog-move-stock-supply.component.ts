import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { SupplyModel } from '../../supplies/supply.model';
import { InventorySuppliesService } from '../inventory-supplies.service';

@Component({
    selector: 'app-dialog-move-stock-supply',
    templateUrl: './dialog-move-stock-supply.component.html',
    styleUrls: ['./dialog-move-stock-supply.component.sass']
})
export class DialogMoveStockSupplyComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly supply: SupplyModel,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogMoveStockSupplyComponent>,
        private readonly navigationService: NavigationService,
        private readonly inventorySuppliesService: InventorySuppliesService,
        private readonly authService: AuthService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: [null, Validators.required],
        toOfficeId: [null, Validators.required],
        observations: '',
    })

    isLoading: boolean = false
    offices: OfficeModel[] = []
    private office: OfficeModel = new OfficeModel()

    private handleAuth$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleOffices$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices.filter(e => e._id !== this.office._id)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.dialogRef.disableClose = true
            this.navigationService.loadBarStart()
            const { quantity, toOfficeId, observations } = this.formGroup.value
            const move = {
                toOfficeId,
                observations,
            }
            const moveOutItem = {
                supplyId: this.supply._id,
                quantity,
                igvCode: '10',
                unitCode: 'NIU'
            }
            this.inventorySuppliesService.moveStock(move, [moveOutItem]).subscribe(() => {
                this.dialogRef.disableClose = false
                this.navigationService.loadBarFinish()
                this.dialogRef.close(quantity)
                this.navigationService.showMessage('Registrado correctamente')
            }, (error: HttpErrorResponse) => {
                this.dialogRef.disableClose = false
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
                this.isLoading = false
            })
        }
    }

}