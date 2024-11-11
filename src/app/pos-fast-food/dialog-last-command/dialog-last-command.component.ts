import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { BoardModel } from '../../boards/board.model';
import { BoardsService } from '../../boards/boards.service';
import { PrintService } from '../../print/print.service';

@Component({
    selector: 'app-dialog-last-command',
    templateUrl: './dialog-last-command.component.html',
    styleUrls: ['./dialog-last-command.component.sass']
})
export class DialogLastCommandComponent {

    constructor(
        private readonly boardsService: BoardsService,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
        private readonly dialogRef: MatDialogRef<DialogLastCommandComponent>
    ) { }

    boards: BoardModel[] = []
    office: OfficeModel = new OfficeModel()
    setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.boardsService.getBoardsOfTheDay().subscribe(boards => {
            this.boards = boards
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
        })
    }

    printBoard(boardId: string) {
        this.dialogRef.close()
        this.boardsService.getBoardById(boardId).subscribe(board => {

            switch (this.setting.papelImpresion) {
                case 'ticket58mm':
                    this.printService.printCommand58mm(board)
                    break
                default:
                    this.printService.printCommand80mm(board)
                    break
            }

        })
    }

}
