import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { MaterialModule } from '../../material.module'
import { TransfersService } from '../../transfers/transfers.service'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../../offices/offices.service'
import { ProductModel } from '../../products/product.model'

@Component({
    selector: 'app-dialog-create-transfers',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-create-transfers.component.html',
    styleUrl: './dialog-create-transfers.component.sass',
})
export class DialogCreateTransfersComponent {

    private readonly product: ProductModel = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly officesService = inject(OfficesService)
    private readonly transfersService = inject(TransfersService)
    private readonly authService = inject(AuthService)
    private readonly dialogRef: MatDialogRef<DialogCreateTransfersComponent> = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        quantity: ['', Validators.required],
        toOfficeId: [null, Validators.required],
        observation: '',
    })
    $isLoading = signal<boolean>(false)
    $offices = signal<OfficeModel[]>([])
    private office: OfficeModel = new OfficeModel()

    private handleAuth$: Subscription = new Subscription()
    private handleOfficesByActivity$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleOfficesByActivity$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.handleOfficesByActivity$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
                const filterOffices = offices.filter(e => e.id !== this.office.id)
                this.$offices.set(filterOffices)
            })
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.dialogRef.disableClose = true
            this.navigationService.loadBarStart()
            const { quantity, toOfficeId, observation } = this.formGroup.value
            const transfer = {
                toOfficeId,
                observation,
            }
            const inIncidentItem = {
                fullName: this.product.fullName,
                quantity,
                price: this.product.price,
                const: this.product.cost,
                unitCode: this.product.unitCode,
                productId: this.product.id,
            }
            this.transfersService.create(transfer, [inIncidentItem]).subscribe({
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
