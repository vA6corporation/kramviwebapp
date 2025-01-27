import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductModel } from '../../products/product.model';
import { IncidentsService } from '../../incidents/incidents.service';

@Component({
    selector: 'app-dialog-add-stock',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-add-stock.component.html',
    styleUrls: ['./dialog-add-stock.component.sass']
})
export class DialogAddStockComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly product: ProductModel,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogAddStockComponent>,
        private readonly navigationService: NavigationService,
        private readonly incidentsService: IncidentsService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: ['', Validators.required],
        observations: ''
    })
    isLoading: boolean = false

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.dialogRef.disableClose = true
            this.isLoading = true
            const { quantity, observations } = this.formGroup.value
            const incident = {
                observations,
            }
            const incidentItem = {
                fullName: this.product.fullName,
                productId: this.product._id,
                preIgvCode: this.product.igvCode,
                cost: this.product.cost,
                quantity,
                igvCode: '10',
                unitCode: 'NIU'
            }
            this.incidentsService.createIn(incident, [incidentItem]).subscribe({
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
