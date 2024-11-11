import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TurnModel } from '../turn.model';
import { TurnsService } from '../turns.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-change-turn',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-change-turn.component.html',
    styleUrls: ['./dialog-change-turn.component.sass']
})
export class DialogChangeTurnComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly saleId: string,
        private readonly turnsService: TurnsService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogChangeTurnComponent>
    ) { }

    turns: TurnModel[] = []
    onUpdate: EventEmitter<void> = new EventEmitter()

    ngOnInit(): void {
        this.turnsService.getTurnsByPage(1, 20, {}).subscribe(turns => {
            this.turns = turns
        })
    }

    onChangeTurn(turnId: string) {
        this.dialogRef.disableClose = true
        this.navigationService.loadBarStart()
        this.dialogRef.close()
        this.turnsService.changeTurn(this.saleId, turnId).subscribe(() => {
            this.onUpdate.next()
            this.navigationService.loadBarFinish()
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

}
