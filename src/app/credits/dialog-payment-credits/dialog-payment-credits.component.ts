import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { CreditsService } from '../credits.service';
import { CreditModel } from '../credit.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-payment-credits',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-payment-credits.component.html',
    styleUrls: ['./dialog-payment-credits.component.sass']
})
export class DialogPaymentCreditsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly credits: CreditModel[],
        private readonly formBuilder: FormBuilder,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly turnsService: TurnsService,
        private readonly creditsService: CreditsService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogPaymentCreditsComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        paymentMethodId: [null, Validators.required],
    })
    paymentMethods: PaymentMethodModel[] = []
    isLoading: boolean = false
    payed = this.credits.map(e => e.payed).reduce((a, b) => a + b, 0)
    charge = this.credits.map(e => e.charge).reduce((a, b) => a + b, 0)
    private turn: TurnModel | null = null
    private setting: SettingModel = new SettingModel()

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
            this.setting = auth.setting

            this.handleTurn$ = this.turnsService.handleOpenTurn(this.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
            })
        })
    }

    onSubmit() {
        if (this.formGroup.valid && this.turn) {
            const { paymentMethodId } = this.formGroup.value
            this.isLoading = true
            this.creditsService.paidCustomerCredits(this.credits.map(e => e._id), paymentMethodId, this.turn._id).subscribe(() => {
                this.dialogRef.close(true)
            })
        }
    }

}
