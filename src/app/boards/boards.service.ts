import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CreatePaymentModel } from '../payments/create-payment.model';
import { ProductModel } from '../products/product.model';
import { CreateSaleModel } from '../sales/create-sale.model';
import { SaleModel } from '../sales/sale.model';
import { BoardItemModel } from './board-item.model';
import { BoardModel } from './board.model';
import { HttpService } from '../http.service';
import { SummaryBoardModel } from './summary-board.model';
import { CreateBoardItemModel } from './create-board-item.model';
import { io } from "socket.io-client";

@Injectable({
    providedIn: 'root'
})
export class BoardsService {

    constructor(
        private readonly httpService: HttpService,
    ) { 
        this.socket.on('changeBoards', () => {
            // this.fetchData()
            this.handleChangeBoards$.next()
        })
    }

    private boardItems: CreateBoardItemModel[] = []
    private board: BoardModel | null = null
    private socket = io('http://localhost:3000')

    private boardItems$ = new BehaviorSubject<CreateBoardItemModel[]>([])
    private handleChangeBoards$: Subject<void> = new Subject()

    handleChangeBoards() {
        return this.handleChangeBoards$.asObservable()
    }

    setBoard(board: BoardModel | null) {
        this.board = board
    }

    getBoard() {
        return this.board
    }

    forceAddBoardItem(product: ProductModel, annotation: string = "") {
        const boardItem: CreateBoardItemModel = {
            printZone: product.printZone,
            fullName: product.fullName,
            onModel: product.onModel,
            productId: product._id,
            price: product.price,
            quantity: 1,
            preQuantity: 0,
            deletedQuantity: 0,
            boardId: '',
            unitCode: product.unitCode,
            igvCode: product.igvCode,
            preIgvCode: product.igvCode,
            isTrackStock: product.isTrackStock,
            observations: annotation,
        }
        this.boardItems.push(boardItem)
        this.boardItems$.next(this.boardItems)
    }

    addBoardItem(product: ProductModel, annotation: string = "") {
        const index = this.boardItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode && e.observations === annotation)
        if (index < 0) {
            const boardItem: CreateBoardItemModel = {
                printZone: product.printZone,
                fullName: product.fullName,
                onModel: product.onModel,
                productId: product._id,
                price: product.price,
                quantity: 1,
                preQuantity: 0,
                deletedQuantity: 0,
                boardId: '',
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                isTrackStock: product.isTrackStock,
                observations: annotation,
            }
            this.boardItems.push(boardItem)
        } else {
            const boardItem: CreateBoardItemModel = this.boardItems[index]
            boardItem.quantity += 1
            this.boardItems.splice(index, 1, boardItem)
        }
        this.boardItems$.next(this.boardItems)
    }

    getBoards(): Observable<BoardModel[]> {
        return this.httpService.get('boards')
    }

    getCharge(): number {
        let sum = 0
        for (const boardItem of this.boardItems) {
            if (boardItem.igvCode !== '11') {
                sum += boardItem.price * boardItem.quantity
            }
        }
        return sum
    }

    setBoardItems(boardItems: CreateBoardItemModel[]) {
        this.boardItems = boardItems
        this.boardItems$.next(this.boardItems)
    }

    getBaordItem(index: number): CreateBoardItemModel {
        return this.boardItems[index]
    }

    updateBoardItem(index: number, boardItem: CreateBoardItemModel) {
        this.boardItems.splice(index, 1, boardItem)
        this.boardItems$.next(this.boardItems)
    }

    removeBoardItem(index: number) {
        this.boardItems.splice(index, 1)
        this.boardItems$.next(this.boardItems)
    }

    handleBoardItems(): Observable<CreateBoardItemModel[]> {
        return this.boardItems$.asObservable()
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

    getBoardById(boardId: string): Observable<BoardModel> {
        return this.httpService.get(`boards/byId/${boardId}`)
    }

    getActiveBoardByTable(tableId: string): Observable<BoardModel> {
        return this.httpService.get(`boards/activeBoardByTable/${tableId}`)
    }

    getActiveBoards(): Observable<BoardModel[]> {
        return this.httpService.get(`boards/activeBoards`)
    }

    getDeletedBoards(pageIndex: number, pageSize: number): Observable<{ boards: BoardModel[], count: number }> {
        return this.httpService.get(`boards/deletedBoards/${pageIndex}/${pageSize}`)
    }

    delete(boardNumber: string, observations: string) {
        return this.httpService.delete(`boards/${boardNumber}/${observations}`)
    }

    deleteBoardItem(boardId: string, boardItemId: string, quantity: number) {
        return this.httpService.delete(`boards/boardItem/${boardId}/${boardItemId}/${quantity}`)
    }

    changeBoard(boardId: string, tableId: string) {
        return this.httpService.get(`boards/changeBoard/${boardId}/${tableId}`)
    }

    splitBoard(
        boardItems: any[], 
        preBoardItems: any[],
        boardId: string,
        tableId: string
    ): Observable<any> {
        console.log(tableId)
        return this.httpService.post(`boards/splitBoards/${boardId}/${tableId}`, { boardItems, preBoardItems })
    }

    create(
        tableId: string,
        boardItems: CreateBoardItemModel[],
        preBoardItems: BoardItemModel[],
    ): Observable<BoardModel> {
        return this.httpService.post(`boards/${tableId}`, { boardItems, preBoardItems })
    }

    saveSaleSplit(
        sale: CreateSaleModel,
        boardItems: CreateBoardItemModel[],
        preBoardItems: CreateBoardItemModel[],
        payments: CreatePaymentModel[],
        boardId: string
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
