import { Injectable } from '@angular/core'
import { Params } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { CreatePaymentModel } from '../payments/create-payment.model'
import { ProductModel } from '../products/product.model'
import { CreateSaleModel } from '../sales/create-sale.model'
import { SaleModel } from '../sales/sale.model'
import { BoardItemModel } from './board-item.model'
import { BoardModel } from './board.model'
import { PreaccountModel } from './preaccount.model'
import { CreateBoardItemModel } from './create-board-item.model'
import { SummaryBoardModel } from './summary-board.model'
import { IgvCode } from '../sales/igv-code.enum'

@Injectable({
    providedIn: 'root'
})
export class BoardsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private boardItems: CreateBoardItemModel[] = []
    private handleBoardItems$ = new BehaviorSubject<CreateBoardItemModel[]>([])
    private handleBoard$ = new BehaviorSubject<BoardModel | null>(null)

    handleBoard() {
        return this.handleBoard$.asObservable()
    }

    setBoard(board: BoardModel | null) {
        this.handleBoard$.next(board)
    }

    forceAddBoardItem(product: ProductModel, annotation: string = '') {
        const boardItem: CreateBoardItemModel = {
            printZone: product.printZone,
            fullName: product.fullName,
            productId: product.id,
            price: product.price,
            cost: product.cost,
            quantity: 1,
            preQuantity: 0,
            deletedQuantity: 0,
            boardId: '',
            unitCode: product.unitCode,
            igvCode: product.igvCode,
            preIgvCode: product.igvCode,
            isTrackStock: product.isTrackStock,
            observation: annotation,
        }
        this.boardItems.push(boardItem)
        this.handleBoardItems$.next(this.boardItems)
    }

    addBoardItem(product: ProductModel, annotation: string = '') {
        const index = this.boardItems.findIndex(e => e.productId === product.id && e.igvCode === product.igvCode && e.observation === annotation)
        if (index < 0) {
            const boardItem: CreateBoardItemModel = {
                printZone: product.printZone,
                fullName: product.fullName,
                productId: product.id,
                price: product.price,
                cost: product.cost,
                quantity: 1,
                preQuantity: 0,
                deletedQuantity: 0,
                boardId: '',
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                isTrackStock: product.isTrackStock,
                observation: annotation,
            }
            this.boardItems.push(boardItem)
        } else {
            const boardItem: CreateBoardItemModel = this.boardItems[index]
            boardItem.quantity += 1
            this.boardItems.splice(index, 1, boardItem)
        }
        this.handleBoardItems$.next(this.boardItems)
    }

    getBoards(): Observable<BoardModel[]> {
        return this.httpService.get('boards')
    }

    getCharge(): number {
        let sum = 0
        for (const boardItem of this.boardItems) {
            if (boardItem.igvCode !== IgvCode.BONIFICACION) {
                sum += boardItem.price * boardItem.quantity
            }
        }
        return sum
    }

    setBoardItems(boardItems: CreateBoardItemModel[]) {
        this.boardItems = boardItems
        this.handleBoardItems$.next(this.boardItems)
    }

    getBaordItem(index: number): CreateBoardItemModel {
        return this.boardItems[index]
    }

    updateBoardItem(index: number, boardItem: CreateBoardItemModel) {
        this.boardItems.splice(index, 1, boardItem)
        this.handleBoardItems$.next(this.boardItems)
    }

    removeBoardItem(index: number) {
        this.boardItems.splice(index, 1)
        this.handleBoardItems$.next(this.boardItems)
    }

    handleBoardItems(): Observable<CreateBoardItemModel[]> {
        return this.handleBoardItems$.asObservable()
    }

    getCountBoards(
        params: Params
    ): Observable<number> {
        return this.httpService.get(`boards/countBoards`, params)
    }

    getBoardsOfTheDay(): Observable<BoardModel[]> {
        return this.httpService.get('boards/boardsOfTheDay')
    }

    getSummaryBoardsByRangeDate(startDate: string, endDate: string): Observable<SummaryBoardModel[]> {
        return this.httpService.get(`boards/summaryBoardsByRangeDate/${startDate}/${endDate}`)
    }

    getBoardsByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<BoardModel[]> {
        return this.httpService.get(`boards/byPage/${pageIndex}/${pageSize}`, params)
    }

    getBoardsWithDetails(): Observable<BoardModel[]> {
        return this.httpService.get('boards/withDetails')
    }

    getBoardItem(index: number): CreateBoardItemModel {
        return this.boardItems[index]
    }

    getBoardById(boardId: any): Observable<BoardModel> {
        return this.httpService.get(`boards/byId/${boardId}`)
    }

    getActiveBoardByTable(tableId: any): Observable<BoardModel> {
        return this.httpService.get(`boards/activeBoardByTable/${tableId}`)
    }

    getActiveBoards(): Observable<BoardModel[]> {
        return this.httpService.get(`boards/activeBoards`)
    }

    getDeletedBoards(pageIndex: number, pageSize: number): Observable<{ boards: BoardModel[], count: number }> {
        return this.httpService.get(`boards/deletedBoards/${pageIndex}/${pageSize}`)
    }

    delete(boardNumber: any, observation: string) {
        return this.httpService.delete(`boards/${boardNumber}/${observation}`)
    }

    deleteBoardItem(boardId: any, boardItemId: any, quantity: number) {
        return this.httpService.delete(`boards/boardItem/${boardId}/${boardItemId}/${quantity}`)
    }

    changeBoard(boardId: any, tableId: any) {
        return this.httpService.get(`boards/changeBoard/${boardId}/${tableId}`)
    }

    splitBoard(
        boardItems: any[],
        preBoardItems: any[],
        boardId: any,
        tableId: any
    ): Observable<any> {
        return this.httpService.post(`boards/splitBoards/${boardId}/${tableId}`, { boardItems, preBoardItems })
    }

    create(
        tableId: any,
        boardItems: CreateBoardItemModel[],
        preBoardItems: BoardItemModel[],
    ): Observable<BoardModel> {
        return this.httpService.post(`boards/${tableId}`, { boardItems, preBoardItems })
    }

    createPreaccount(
        boardId: any,
        tableId: any,
        preaccountItems: CreateBoardItemModel[],
    ): Observable<PreaccountModel> {
        return this.httpService.post(`preaccounts/${boardId}/${tableId}`, { preaccountItems })
    }

    saveSaleSplit(
        sale: CreateSaleModel,
        boardItems: CreateBoardItemModel[],
        preBoardItems: CreateBoardItemModel[],
        payments: CreatePaymentModel[],
        boardId: any
    ): Observable<SaleModel> {
        return this.httpService.post('sales/splitBoard', {
            sale,
            saleItems: boardItems,
            preBoardItems,
            payments,
            boardId
        })
    }

}
