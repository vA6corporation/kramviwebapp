import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { NavigationService } from '../../navigation/navigation.service'
import { ProductModel } from '../../products/product.model'
import { IncidentsService } from '../../incidents/incidents.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-remove-stock',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-remove-stock.component.html',
    styleUrls: ['./dialog-remove-stock.component.sass']
})
export class DialogRemoveStockComponent {

    private readonly product: ProductModel = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly dialogRef = inject(MatDialogRef)
    private readonly navigationService = inject(NavigationService)
    private readonly incidentsService = inject(IncidentsService)

    formGroup: FormGroup = this.formBuilder.group({
        quantity: ['', Validators.required],
        observation: '',
    })
    $isLoading = signal<boolean>(false)

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.dialogRef.disableClose = true
            this.$isLoading.set(true)
            const { quantity, observation } = this.formGroup.value
            const incident = {
                observation,
            }
            const outIncidentItem = {
                fullName: this.product.fullName,
                productId: this.product.id,
                preIgvCode: this.product.igvCode,
                price: this.product.price,
                cost: this.product.cost,
                quantity,
                igvCode: '10',
                unitCode: 'NIU'
            }
            this.incidentsService.createOut(incident, [outIncidentItem]).subscribe({
                next: () => {
                    this.dialogRef.disableClose = false
                    this.navigationService.loadBarFinish()
                    this.dialogRef.close(true)
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.dialogRef.disableClose = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                    this.$isLoading.set(false)
                }
            })
        }
    }
}
