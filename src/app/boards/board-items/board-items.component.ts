import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BoardsService } from '../boards.service';
import { CreateBoardItemModel } from '../create-board-item.model';
import { DialogBoardItemsComponent } from '../dialog-board-items/dialog-board-items.component';
import { DialogPasswordComponent } from '../dialog-password/dialog-password.component';
import { AuthService } from '../../auth/auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { IgvType } from '../../products/igv-type.enum';
import { SettingModel } from '../../auth/setting.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-board-items',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './board-items.component.html',
    styleUrls: ['./board-items.component.sass']
})
export class BoardItemsComponent implements OnInit {

    constructor(
        private readonly boardsService: BoardsService,
        private readonly authService: AuthService,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
    ) { }

    igvType = IgvType
    boardItems: CreateBoardItemModel[] = []
    charge: number = 0
    private setting: SettingModel = new SettingModel()

    private handleBoardItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleBoardItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.handleBoardItems$ = this.boardsService.handleBoardItems().subscribe(boardItems => {
            this.boardItems = boardItems
            this.charge = 0
            for (const boardItem of this.boardItems) {
                if (boardItem.igvCode !== '11') {
                    this.charge += boardItem.price * boardItem.quantity
                }
            }
        })
    }

    onSelectBoardItem(index: number) {
        const boardItem = this.boardsService.getBaordItem(index)
        const dialogRef = this.matDialog.open(DialogBoardItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: boardItem,
        })

        dialogRef.componentInstance.handleUpdateBoardItem().subscribe(updateBoardItem => {
            if (this.setting.password && boardItem._id && updateBoardItem.quantity < boardItem.quantity) {
                const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })

                dialogRef.afterClosed().subscribe(ok => {
                    if (ok) {
                        boardItem.price = updateBoardItem.price
                        boardItem.observations = updateBoardItem.observations
                        if (updateBoardItem.isBonus) {
                            boardItem.igvCode = IgvType.BONIFICACION
                        } else {
                            boardItem.igvCode = boardItem.preIgvCode
                        }
                        this.boardsService.updateBoardItem(index, boardItem)

                        this.navigationService.loadBarStart()
                        this.boardsService.deleteBoardItem(boardItem.boardId, boardItem._id, boardItem.quantity - updateBoardItem.quantity).subscribe({
                            next: () => {
                                if (boardItem.quantity === 0) {
                                    this.boardsService.removeBoardItem(index)
                                }
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage('Eliminado correctamente')
                                boardItem.quantity = updateBoardItem.quantity
                                boardItem.preQuantity = boardItem.quantity
                            }, error: (error: HttpErrorResponse) => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage(error.error.message)
                            }
                        })
                    }
                })
            } else {
                if (boardItem._id && updateBoardItem.quantity < boardItem.quantity) {
                    const ok = confirm('Este producto ya fue comandado, esta seguro de anular?...')
                    if (ok) {
                        this.navigationService.loadBarStart()
                        boardItem.price = updateBoardItem.price
                        boardItem.observations = updateBoardItem.observations
                        if (updateBoardItem.isBonus) {
                            boardItem.igvCode = IgvType.BONIFICACION
                        } else {
                            boardItem.igvCode = boardItem.preIgvCode
                        }
                        this.boardsService.deleteBoardItem(boardItem.boardId, boardItem._id, boardItem.quantity - updateBoardItem.quantity).subscribe({
                            next: () => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage('Anulado correctamente')
                                boardItem.quantity = updateBoardItem.quantity
                                boardItem.price = updateBoardItem.price
                                boardItem.observations = updateBoardItem.observations
                                boardItem.preQuantity = boardItem.quantity
                                if (boardItem.quantity === 0) {
                                    this.boardsService.removeBoardItem(index)
                                }
                            }, error: (error: HttpErrorResponse) => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage(error.error.message)
                            }
                        })
                    }
                } else {
                    boardItem.quantity = updateBoardItem.quantity
                    boardItem.price = updateBoardItem.price
                    boardItem.observations = updateBoardItem.observations
                    if (updateBoardItem.isBonus) {
                        boardItem.igvCode = IgvType.BONIFICACION
                    } else {
                        boardItem.igvCode = boardItem.preIgvCode
                    }
                    this.boardsService.updateBoardItem(index, boardItem)
                }
            }
        })

        dialogRef.componentInstance.handleDeleteBoardItem().subscribe(() => {
            if (boardItem._id) {
                if (this.setting.password) {
                    const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(ok => {
                        if (ok && boardItem._id) {
                            this.boardsService.deleteBoardItem(boardItem.boardId, boardItem._id, boardItem.quantity).subscribe({
                                next: () => {
                                    this.navigationService.showMessage('Anulado correctamente')
                                    this.boardsService.removeBoardItem(index)
                                }, error: (error: HttpErrorResponse) => {
                                    this.navigationService.loadBarFinish()
                                    this.navigationService.showMessage(error.error.message)
                                }
                            })
                        }
                    })
                } else {
                    const ok = confirm('Esta producto ya fue ordenado, esta seguro de anular?...')
                    if (ok) {
                        this.boardsService.deleteBoardItem(boardItem.boardId, boardItem._id, boardItem.quantity).subscribe({
                            next: () => {
                                this.navigationService.showMessage('Anulado correctamente')
                                this.boardsService.removeBoardItem(index)
                            }, error: (error: HttpErrorResponse) => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage(error.error.message)
                            }
                        })
                    }
                }
            } else {
                this.boardsService.removeBoardItem(index)
            }
        })
    }

}
