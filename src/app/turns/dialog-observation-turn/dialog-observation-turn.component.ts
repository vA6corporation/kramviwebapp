import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TurnsService } from '../turns.service';
import { TurnModel } from '../turn.model';
import { AuthService } from '../../auth/auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { SettingModel } from '../../auth/setting.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-observation-turn',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-observation-turn.component.html',
    styleUrls: ['./dialog-observation-turn.component.sass']
})
export class DialogObservationTurnComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly turn: TurnModel,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogObservationTurnComponent>,
        private readonly authService: AuthService,
        private readonly turnsService: TurnsService,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        observations: ''
    })
    isLoading: boolean = false

    private setting: SettingModel = new SettingModel()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.dialogRef.close()
            const { observations } = this.formGroup.value
            Object.assign(this.turn, { observations })
            this.turnsService.update(this.turn._id, this.turn).subscribe({
                next: () => {
                    if (this.setting.isOfficeTurn) {
                        this.turnsService.loadTurnOffice()
                    } else {
                        this.turnsService.loadTurnUser()
                    }
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
