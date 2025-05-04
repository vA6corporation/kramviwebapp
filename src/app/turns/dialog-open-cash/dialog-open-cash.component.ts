import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { TurnModel } from '../turn.model';
import { TurnsService } from '../turns.service';

@Component({
    selector: 'app-dialog-open-cash',
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
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        openCash: ['', Validators.required]
    })
    isLoading: boolean = false

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.dialogRef.close()
            const { openCash } = this.formGroup.value
            Object.assign(this.turn, { openCash })
            this.turnsService.update(this.turn._id, this.turn).subscribe(() => {
                this.turnsService.loadTurn()
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Se han guardado los cambios')
                this.dialogRef.close()
            })
        }
    }
}
