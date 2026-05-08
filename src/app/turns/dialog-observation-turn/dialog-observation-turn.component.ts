import { Component, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { TurnModel } from '../turn.model'
import { TurnsService } from '../turns.service'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'

@Component({
    selector: 'app-dialog-observation-turn',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-observation-turn.component.html',
    styleUrls: ['./dialog-observation-turn.component.sass']
})
export class DialogObservationTurnComponent {

    private readonly turn: TurnModel = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly dialogRef: MatDialogRef<DialogObservationTurnComponent> = inject(MatDialogRef)
    private readonly turnsService = inject(TurnsService)
    private readonly authService = inject(AuthService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        observation: ''
    })
    isLoading: boolean = false
    private setting = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.dialogRef.close()
            const { observation } = this.formGroup.value
            Object.assign(this.turn, { observation })
            this.turnsService.update(this.turn.id, this.turn).subscribe({
                next: () => {
                    this.turnsService.loadTurn(this.setting.isOfficeTurn)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
