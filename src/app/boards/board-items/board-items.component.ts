import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { BoardsService } from '../boards.service'
import { DialogBoardItemsComponent } from '../dialog-board-items/dialog-board-items.component'
import { DialogPasswordComponent } from '../../sales/dialog-password/dialog-password.component'
import { AuthService } from '../../auth/auth.service'
import { NavigationService } from '../../navigation/navigation.service'
import { IgvCode } from '../../sales/igv-code.enum'
import { SettingModel } from '../../settings/setting.model'
import { MaterialModule } from '../../material.module'
import { CreateBoardItemModel } from '../create-board-item.model'
import { BoardModel } from '../board.model'
import { PrintService } from '../../print/print.service'

@Component({
    selector: 'app-board-items',
    imports: [MaterialModule],
    templateUrl: './board-items.component.html',
    styleUrls: ['./board-items.component.sass']
})
export class BoardItemsComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly boardsService = inject(BoardsService)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)
    private readonly matDialog = inject(MatDialog)

    igvCode = IgvCode
    $boardItems = signal<CreateBoardItemModel[]>([])
    $charge = signal<number>(0)
    $countProducts = signal<number>(0)
    private setting: SettingModel = new SettingModel()
    private board: BoardModel | null = null

    private handleBoard$: Subscription = new Subscription()
    private handleBoardItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleBoard$.unsubscribe()
        this.handleBoardItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.handleBoardItems$ = this.boardsService.handleBoardItems().subscribe(boardItems => {
            this.$boardItems.set(boardItems)
            this.$charge.set(0)
            this.$countProducts.set(0)
            let charge = 0
            let countProducts = 0
            for (const boardItem of boardItems) {
                countProducts += boardItem.quantity
                if (boardItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += boardItem.price * boardItem.quantity
                }
            }
            this.$charge.set(charge)
            this.$countProducts.set(countProducts)
        })

        this.handleBoard$ = this.boardsService.handleBoard().subscribe(board => {
            this.board = board
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
            if (this.setting.password && boardItem.id && updateBoardItem.quantity < boardItem.quantity) {
                const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })

                dialogRef.afterClosed().subscribe(ok => {
                    if (ok) {
                        boardItem.price = updateBoardItem.price
                        boardItem.observation = updateBoardItem.observation
                        if (updateBoardItem.isBonus) {
                            boardItem.igvCode = IgvCode.BONIFICACION
                        } else {
                            boardItem.igvCode = boardItem.preIgvCode
                        }
                        this.boardsService.updateBoardItem(index, boardItem)

                        this.navigationService.loadBarStart()
                        if (boardItem.id) {
                            this.navigationService.loadBarStart()
                            this.boardsService.deleteBoardItem(boardItem.boardId, boardItem.id, boardItem.quantity - updateBoardItem.quantity).subscribe({
                                next: () => {
                                    this.navigationService.loadBarFinish()
                                    if (boardItem.quantity === 0) {
                                        this.boardsService.removeBoardItem(index)
                                    }
                                    this.navigationService.loadBarFinish()
                                    this.navigationService.showMessage('Anulado correctamente')
                                    boardItem.quantity = updateBoardItem.quantity
                                    boardItem.preQuantity = boardItem.quantity
                                    const board = JSON.parse(JSON.stringify(this.board))
                                    board.boardItems = [boardItem]
                                    this.printService.printDeletedCommand80mm(board)
                                }, error: (error: HttpErrorResponse) => {
                                    this.navigationService.loadBarFinish()
                                    this.navigationService.showMessage(error.error.message)
                                }
                            })
                        }
                    }
                })
            } else {
                if (boardItem.id && updateBoardItem.quantity < boardItem.quantity) {
                    const ok = confirm('Este producto ya fue comandado, esta seguro de anular?...')
                    if (ok) {
                        this.navigationService.loadBarStart()
                        boardItem.price = updateBoardItem.price
                        boardItem.observation = updateBoardItem.observation
                        if (updateBoardItem.isBonus) {
                            boardItem.igvCode = IgvCode.BONIFICACION
                        } else {
                            boardItem.igvCode = boardItem.preIgvCode
                        }
                        this.navigationService.loadBarStart()
                        this.boardsService.deleteBoardItem(boardItem.boardId, boardItem.id, boardItem.quantity - updateBoardItem.quantity).subscribe({
                            next: () => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage('Anulado correctamente')
                                boardItem.quantity = updateBoardItem.quantity
                                boardItem.price = updateBoardItem.price
                                boardItem.observation = updateBoardItem.observation
                                boardItem.preQuantity = boardItem.quantity
                                if (boardItem.quantity === 0) {
                                    this.boardsService.removeBoardItem(index)
                                }
                                const board = JSON.parse(JSON.stringify(this.board))
                                board.boardItems = [boardItem]
                                this.printService.printDeletedCommand80mm(board)
                            }, error: (error: HttpErrorResponse) => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage(error.error.message)
                            }
                        })
                    }
                } else {
                    boardItem.quantity = updateBoardItem.quantity
                    boardItem.price = updateBoardItem.price
                    boardItem.observation = updateBoardItem.observation
                    if (updateBoardItem.isBonus) {
                        boardItem.igvCode = IgvCode.BONIFICACION
                    } else {
                        boardItem.igvCode = boardItem.preIgvCode
                    }
                    this.boardsService.updateBoardItem(index, boardItem)
                }
            }
        })

        dialogRef.componentInstance.handleDeleteBoardItem().subscribe(() => {
            if (boardItem.id) {
                if (this.setting.password) {
                    const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(ok => {
                        if (ok && boardItem.id) {
                            this.navigationService.loadBarStart()
                            this.boardsService.deleteBoardItem(boardItem.boardId, boardItem.id, boardItem.quantity).subscribe({
                                next: () => {
                                    this.navigationService.loadBarFinish()
                                    this.navigationService.showMessage('Anulado correctamente')
                                    this.boardsService.removeBoardItem(index)
                                    const board = JSON.parse(JSON.stringify(this.board))
                                    board.boardItems = [boardItem]
                                    this.printService.printDeletedCommand80mm(board)
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
                        this.navigationService.loadBarStart()
                        this.boardsService.deleteBoardItem(boardItem.boardId, boardItem.id, boardItem.quantity).subscribe({
                            next: () => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage('Anulado correctamente')
                                this.boardsService.removeBoardItem(index)
                                const board = JSON.parse(JSON.stringify(this.board))
                                board.boardItems = [boardItem]
                                this.printService.printDeletedCommand80mm(board)
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
