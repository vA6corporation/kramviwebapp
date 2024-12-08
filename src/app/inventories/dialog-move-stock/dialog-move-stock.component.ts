import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { MaterialModule } from '../../material.module';
import { MovesService } from '../../moves/moves.service';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { ProductModel } from '../../products/product.model';

@Component({
    selector: 'app-dialog-move-stock',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-move-stock.component.html',
    styleUrls: ['./dialog-move-stock.component.sass']
})
export class DialogMoveStockComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly product: ProductModel,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogMoveStockComponent>,
        private readonly navigationService: NavigationService,
        private readonly officesService: OfficesService,
        private readonly movesService: MovesService,
        private readonly authService: AuthService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: ['', Validators.required],
        toOfficeId: [null, Validators.required],
        observations: '',
    })
    isLoading: boolean = false
    offices: OfficeModel[] = []
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
                this.offices = offices.filter(e => e._id !== this.office._id)
            })
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
            const moveItem = {
                fullName: this.product.fullName,
                quantity,
                productId: this.product._id,
            }
            this.movesService.create(move, [moveItem]).subscribe({
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
