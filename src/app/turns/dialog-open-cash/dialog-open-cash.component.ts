import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TurnsService } from '../turns.service';
import { TurnModel } from '../turn.model';
import { AuthService } from '../../auth/auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { SettingModel } from '../../auth/setting.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-open-cash',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-open-cash.component.html',
    styleUrls: ['./dialog-open-cash.component.sass']
})
export class DialogOpenCashComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly turn: TurnModel,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogOpenCashComponent>,
        private readonly turnsService: TurnsService,
        private readonly authService: AuthService,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        openCash: ['', Validators.required]
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
            const { openCash } = this.formGroup.value
            Object.assign(this.turn, { openCash })
            this.turnsService.update(this.turn._id, this.turn).subscribe(() => {
                if (this.setting.isOfficeTurn) {
                    this.turnsService.loadTurnOffice()
                } else {
                    this.turnsService.loadTurnUser()
                }
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Se han guardado los cambios')
                this.dialogRef.close()
            })
        }
    }
}
