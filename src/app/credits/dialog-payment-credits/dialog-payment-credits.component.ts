import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { MaterialModule } from '../../material.module'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { TurnModel } from '../../turns/turn.model'
import { TurnsService } from '../../turns/turns.service'
import { CreditModel } from '../credit.model'
import { CreditsService } from '../credits.service'
import { AuthService } from '../../auth/auth.service'

@Component({
    selector: 'app-dialog-payment-credits',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-payment-credits.component.html',
    styleUrls: ['./dialog-payment-credits.component.sass']
})
export class DialogPaymentCreditsComponent {

    private readonly credits: CreditModel[] = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly turnsService = inject(TurnsService)
    private readonly creditsService = inject(CreditsService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly authService = inject(AuthService)
    private readonly dialogRef: MatDialogRef<DialogPaymentCreditsComponent> = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        paymentMethodId: [null, Validators.required],
    })
    paymentMethods: PaymentMethodModel[] = []
    isLoading: boolean = false
    payed = this.credits.map(e => e.payed).reduce((a, b) => a + b, 0)
    charge = this.credits.map(e => e.charge).reduce((a, b) => a + b, 0)
    private turn: TurnModel | null = null

    private handlePaymentMethods$: Subscription = new Subscription()
    private handleTurn$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
        this.handleTurn$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.dialogRef.disableClose = true

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.handleTurn$ = this.turnsService.handleOpenTurn(auth.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
            })
        })

    }

    onSubmit() {
        if (this.formGroup.valid && this.turn) {
            const { paymentMethodId } = this.formGroup.value
            this.isLoading = true
            this.creditsService.paidCustomerCredits(this.credits.map(e => e.id), paymentMethodId, this.turn.id).subscribe(() => {
                this.dialogRef.close(true)
            })
        }
    }

}
