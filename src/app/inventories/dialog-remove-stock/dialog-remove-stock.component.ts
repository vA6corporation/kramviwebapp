import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductModel } from '../../products/product.model';
import { IncidentsService } from '../../incidents/incidents.service';

@Component({
    selector: 'app-dialog-remove-stock',
    templateUrl: './dialog-remove-stock.component.html',
    styleUrls: ['./dialog-remove-stock.component.sass']
})
export class DialogRemoveStockComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly product: ProductModel,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogRemoveStockComponent>,
        private readonly navigationService: NavigationService,
        private readonly incidentsService: IncidentsService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: [null, Validators.required],
        incidentType: [null, Validators.required],
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
        'TRASPASO',
        'OTROS',
    ]

    ngOnInit(): void {
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.dialogRef.disableClose = true
            this.isLoading = true
            const { quantity, incidentType, observations } = this.formGroup.value
            const incident = {
                incidentType,
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
            this.incidentsService.create(incident, [incidentItem]).subscribe({
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
