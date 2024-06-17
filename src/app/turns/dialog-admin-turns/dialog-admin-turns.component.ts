import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TurnsService } from '../turns.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurnModel } from '../turn.model';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-admin-turns',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-admin-turns.component.html',
    styleUrls: ['./dialog-admin-turns.component.sass']
})
export class DialogAdminTurnsComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly turn: TurnModel,
        private readonly turnsService: TurnsService,
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogAdminTurnsComponent>
    ) { }

    private onUpdate$: EventEmitter<void> = new EventEmitter()

    formDate: FormGroup = this.formBuilder.group({
        createdAt: [null, Validators.required],
    })

    ngOnInit(): void {
        this.formDate.patchValue(this.turn)
    }

    handleUpdate() {
        return this.onUpdate$.asObservable()
    }

    onOpenTurn() {
        this.turnsService.updateOpenTurn(this.turn._id).subscribe(() => {
            this.onUpdate$.next()
        })
    }

    onSubmitDate() {
        if (this.formDate.valid) {
            const { createdAt } = this.formDate.value
            this.turnsService.updateCreatedAt(this.turn._id, createdAt).subscribe(() => {
                this.onUpdate$.next()
            })
        }
    }

    onDeleteTurn() {
        this.navigationService.loadBarStart()
        this.dialogRef.close()
        this.turnsService.delete(this.turn._id).subscribe({
            next: () => {
                this.onUpdate$.next()
                this.navigationService.loadBarFinish()
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
                this.navigationService.loadBarFinish()
            }
        })
    }

}
