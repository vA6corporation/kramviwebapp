import { Component, EventEmitter, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TurnModel } from '../turn.model'
import { TurnsService } from '../turns.service'
import { NavigationService } from '../../navigation/navigation.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-dialog-change-turn',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-change-turn.component.html',
    styleUrls: ['./dialog-change-turn.component.sass']
})
export class DialogChangeTurnComponent {

    private readonly saleId: any = inject(MAT_DIALOG_DATA)
    private readonly turnsService = inject(TurnsService)
    private readonly navigationService = inject(NavigationService)
    private readonly dialogRef: MatDialogRef<DialogChangeTurnComponent> = inject(MatDialogRef)

    $turns = signal<TurnModel[]>([])
    onUpdate: EventEmitter<void> = new EventEmitter()

    ngOnInit(): void {
        this.navigationService.loadBarStart()
        this.turnsService.getTurnsByPage(1, 20, {}).subscribe(turns => {
            this.navigationService.loadBarFinish()
            this.$turns.set(turns)
        })
    }

    onChangeTurn(turnId: any) {
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
