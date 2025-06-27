import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { TurnsService } from '../turns.service';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';

@Component({
    selector: 'app-dialog-turns',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-turns.component.html',
    styleUrls: ['./dialog-turns.component.sass']
})
export class DialogTurnsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogTurnsComponent>,
        private readonly turnsService: TurnsService,
        private readonly authService: AuthService,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        openCash: ['', Validators.required]
    })

    private setting = new SettingModel()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.dialogRef.disableClose = true
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.close()
            const { openCash } = this.formGroup.value
            if (this.setting.isOfficeTurn) {
                this.turnsService.createOfficeTurn(openCash)
            } else {
                this.turnsService.createTurn(openCash)
            }
            this.navigationService.showMessage('Caja aperturada')
        }
    }

}
