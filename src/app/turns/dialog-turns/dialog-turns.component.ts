import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TurnsService } from '../turns.service';
import { NavigationService } from '../../navigation/navigation.service';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-turns',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-turns.component.html',
    styleUrls: ['./dialog-turns.component.sass']
})
export class DialogTurnsComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogTurnsComponent>,
        private readonly turnsService: TurnsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        openCash: [null, Validators.required]
    })

    private handleAuth$: Subscription = new Subscription()
    private setting: SettingModel = new SettingModel()

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
                this.turnsService.createTurnOffice(openCash)
            } else {
                this.turnsService.createTurnUser(openCash)
            }
            this.navigationService.showMessage('Caja aperturada')
        }
    }

}
