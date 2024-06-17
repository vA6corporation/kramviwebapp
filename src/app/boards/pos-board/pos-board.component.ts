import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogSelectAnnotationData, DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { TableModel } from '../../tables/table.model';
import { TablesService } from '../../tables/tables.service';
import { UserModel } from '../../users/user.model';
import { BoardItemModel } from '../board-item.model';
import { BoardModel } from '../board.model';
import { BoardsService } from '../boards.service';
import { CreateBoardItemModel } from '../create-board-item.model';
import { DialogDeletedComponent } from '../dialog-deleted/dialog-deleted.component';
import { DialogPasswordComponent } from '../dialog-password/dialog-password.component';
import { DialogSplitBoardsComponent } from '../dialog-split-boards/dialog-split-boards.component';
import { AuthService } from '../../auth/auth.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { BoardItemsComponent } from '../board-items/board-items.component';

@Component({
    selector: 'app-pos-board',
    standalone: true,
    imports: [MaterialModule, CommonModule, BoardItemsComponent, RouterModule],
    templateUrl: './pos-board.component.html',
    styleUrls: ['./pos-board.component.sass']
})
export class PosBoardComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly productsService: ProductsService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
        private readonly boardsService: BoardsService,
        private readonly tablesService: TablesService,
        private readonly printService: PrintService,
        private readonly router: Router,
    ) { }

    table: null | TableModel = null
    board: BoardModel | null = null
    categories: CategoryModel[] = []
    charge: number = 0
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    boardItems: CreateBoardItemModel[] = []
    preBoardItems: BoardItemModel[] = []
    gridListCols = 4
    selectedIndex: number = 0
    setting: SettingModel = new SettingModel()
    products: ProductModel[] = []
    isLoading: boolean = true
    private office: OfficeModel = new OfficeModel()
    private user: UserModel = new UserModel()
    private sortByName: boolean = true

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleBoardItems$: Subscription = new Subscription()
    private handleProducts$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleTables$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleBoardItems$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleProducts$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleTables$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
            this.user = auth.user
        })

        this.handleBoardItems$ = this.boardsService.handleBoardItems().subscribe(boardItems => {
            this.boardItems = boardItems
        })

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
            this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'change_board': {
                    if (this.board) {
                        const board = this.board
                        this.router.navigate(['/boards/changeBoards', board._id])
                    } else {
                        this.navigationService.showMessage('Esta mesa esta sin ordenar')
                    }
                    break
                }
                case 'split_board': {
                    if (this.board) {
                        // this.router.navigate(['/boards/splitBoard', this.board._id])
                        const dialogRef = this.matDialog.open(DialogSplitBoardsComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })
                    } else {
                        this.navigationService.showMessage('Esta mesa esta sin ordenar')
                    }
                    break
                }
                case 'print_preaccount': {
                    if (this.board) {
                        const board = JSON.parse(JSON.stringify(this.board))
                        if (this.setting.papelImpresion === 'ticket80mm') {
                            this.printService.printPreaccount80mm(board)
                        } else {
                            this.printService.printPreaccount58mm(board)
                        }
                    }
                    break
                }
                case 'print_command': {
                    this.onPrintCommand()
                    break
                }
                case 'print_command_complete': {
                    this.onPrintCommandComplete()
                    break
                }
                case 'delete_board': {
                    this.onDeleteBoard()
                }
            }
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.selectedIndex = 2

                    switch (this.setting.defaultPrice) {
                        case PriceType.GLOBAL:
                            this.products = products
                            break
                        case PriceType.OFICINA:
                            for (const product of products) {
                                const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                                product.price = price ? price.price : product.price
                            }
                            this.products = products
                            break
                        case PriceType.LISTA:
                            for (const product of products) {
                                const price = product.prices.find(e => e.priceListId === this.priceListId)
                                product.price = price ? price.price : product.price
                            }
                            this.products = products
                            break
                        case PriceType.LISTAOFICINA:
                            for (const product of products) {
                                const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                                product.price = price ? price.price : product.price
                            }
                            this.products = products
                            break
                    }

                    if (this.sortByName) {
                        this.products.sort((a, b) => {
                            if (a.fullName > b.fullName) {
                                return 1
                            }
                            if (a.fullName < b.fullName) {
                                return -1
                            }
                            return 0
                        })
                    } else {
                        this.products.sort((a, b) => b.price - a.price)
                    }

                    const foundProduct = products.find(e => e.sku.match(new RegExp(`^${key}$`, 'i')) || e.upc.match(new RegExp(`^${key}$`, 'i')))

                    if (foundProduct) {
                        this.onSelectProduct(foundProduct)
                    }

                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            const tableIndex = this.activatedRoute.snapshot.params['tableIndex']
            this.table = tables[tableIndex]
            if (this.table) {
                this.navigationService.setTitle('Mesa ' + this.table.name)
                this.boardsService.setBoard(null)
                this.navigationService.loadBarStart()
                this.boardsService.getActiveBoardByTable(this.table._id).subscribe({
                    next: board => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.board = board
                        this.boardsService.setBoard(board)
                        this.preBoardItems = JSON.parse(JSON.stringify(board.boardItems))
                        this.boardsService.setBoardItems(board.boardItems)
                    }, error: (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        console.log(error.error.message)
                    }
                })
            } else {
                this.router.navigate(['/boards'])
            }
        })

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'print_preaccount', icon: 'printer', label: 'Imprimir precuenta', show: false },
            { id: 'print_command', icon: 'printer', label: 'Imprimir comanda', show: false },
            { id: 'print_command_complete', icon: 'printer', label: 'Imprimir comanda completa', show: false },
            { id: 'change_board', icon: 'north_east', label: 'Cambiar mesa', show: false },
            { id: 'split_board', icon: 'call_split', label: 'Divider mesa', show: false },
            { id: 'delete_board', icon: 'delete', label: 'Anular mesa', show: false },
        ])
    }

    urlImage(product: ProductModel) {
        const styleObject: any = {}
        if (product.urlImage) {
            styleObject['background-image'] = `url(${decodeURIComponent(product.urlImage)})`
            styleObject['background-size'] = 'cover'
            styleObject['background-position'] = 'center'
        } else {
            if (product.isTrackStock && product.stock < 1) {
                styleObject['background'] = '#ffa7a6' 
            }
        }
        return styleObject
    }

    onChangePriceList() {
        const products = this.products
        switch (this.setting.defaultPrice) {
            case PriceType.GLOBAL:
                this.products = products
                break
            case PriceType.OFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId === null)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                break
            case PriceType.LISTA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                break
            case PriceType.LISTAOFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                break
        }
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.boardsService.setBoardItems([])
        }
    }

    onPrintCommand() {
        if (this.board) {
            const board: BoardModel = JSON.parse(JSON.stringify(this.board))
            board.boardItems = board.boardItems.filter(e => (e.quantity - e.preQuantity) > 0)
            board.boardItems.forEach(e => e.quantity = (e.quantity - e.preQuantity))

            if (this.setting.password) {
                const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })

                dialogRef.afterClosed().subscribe(ok => {
                    if (ok) {
                        if (this.setting.papelImpresion === 'ticket80mm') {
                            this.printService.printCommand80mm(board)
                        } else {
                            this.printService.printCommand58mm(board)
                        }
                    }
                })
            } else {
                if (this.setting.papelImpresion === 'ticket80mm') {
                    this.printService.printCommand80mm(board)
                } else {
                    this.printService.printCommand58mm(board)
                }
            }
        }
    }

    onPrintCommandComplete() {
        if (this.board) {
            const board: BoardModel = JSON.parse(JSON.stringify(this.board))

            if (this.setting.password) {
                const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })

                dialogRef.afterClosed().subscribe(ok => {
                    if (ok) {
                        if (this.setting.papelImpresion === 'ticket80mm') {
                            this.printService.printCommand80mm(board)
                        } else {
                            this.printService.printCommand58mm(board)
                        }
                    }
                })
            } else {
                if (this.setting.papelImpresion === 'ticket80mm') {
                    this.printService.printCommand80mm(board)
                } else {
                    this.printService.printCommand58mm(board)
                }
            }
        }
    }

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.products = []
        if (category.products) {
            const products = category.products

            switch (this.setting.defaultPrice) {
                case PriceType.GLOBAL:
                    this.products = products
                    break
                case PriceType.OFICINA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                        product.price = price ? price.price : product.price
                    }
                    this.products = products
                    break
                case PriceType.LISTA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.priceListId === this.priceListId)
                        product.price = price ? price.price : product.price
                    }
                    this.products = products
                    break
                case PriceType.LISTAOFICINA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                        product.price = price ? price.price : product.price
                    }
                    this.products = products
                    break
            }

            if (this.sortByName) {
                this.products.sort((a, b) => {
                    if (a.fullName > b.fullName) {
                        return 1
                    }
                    if (a.fullName < b.fullName) {
                        return -1
                    }
                    return 0
                })
            } else {
                this.products.sort((a, b) => b.price - a.price)
            }

        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category._id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products

                switch (this.setting.defaultPrice) {
                    case PriceType.GLOBAL:
                        this.products = products
                        break
                    case PriceType.OFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
                    case PriceType.LISTAOFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
                }

                if (this.sortByName) {
                    this.products.sort((a, b) => {
                        if (a.fullName > b.fullName) {
                            return 1
                        }
                        if (a.fullName < b.fullName) {
                            return -1
                        }
                        return 0
                    })
                } else {
                    this.products.sort((a, b) => b.price - a.price)
                }
            })
        }
    }

    onSelectProduct(product: ProductModel): void {
        if (product.annotations.length || product.linkProductIds.length) {
            const data: DialogSelectAnnotationData = {
                product,
                priceListId: this.priceListId || '',
            }

            this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data,
            })

        } else {
            this.boardsService.addBoardItem(product)
        }
    }

    onDeleteBoard() {
        if (this.board !== null) {
            const board = this.board
            if (this.setting.password) {
                const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })
                dialogRef.afterClosed().subscribe(ok => {
                    if (ok) {
                        const dialogRef = this.matDialog.open(DialogDeletedComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })
                        dialogRef.afterClosed().subscribe(deletedObservations => {
                            if (deletedObservations) {
                                this.navigationService.loadBarStart()
                                this.boardsService.delete(board._id, deletedObservations).subscribe(() => {
                                    this.navigationService.loadBarFinish()
                                    this.navigationService.showMessage('Eliminado correctamente')
                                    this.router.navigate(['/boards'])
                                })
                            }
                        })
                    }
                })
            } else {
                const dialogRef = this.matDialog.open(DialogDeletedComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })
                dialogRef.afterClosed().subscribe(deletedObservations => {
                    if (deletedObservations) {
                        this.navigationService.loadBarStart()
                        this.boardsService.delete(board._id, deletedObservations).subscribe(() => {
                            this.navigationService.loadBarFinish()
                            this.navigationService.showMessage('Eliminado correctamente')
                            this.router.navigate(['/boards'])
                        })
                    }
                })
            }
        }
    }

    onSubmit() {
        try {
            if (!this.boardItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.boardItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            if (this.table === null) {
                throw new Error("La mesa no existe")
            }

            this.navigationService.loadBarStart()
            this.isLoading = true
            const table = this.table
            this.boardsService.create(this.table._id, this.boardItems, this.preBoardItems).subscribe({
                next: savedBoard => {
                    this.isLoading = false
                    this.navigationService.showMessage('Se han guardado los cambios')
                    if (this.setting.printOrder) {
                        const boardItems: BoardItemModel[] = []

                        for (const boardItem of savedBoard.boardItems) {
                            if (boardItem.quantity - boardItem.preQuantity > 0) {
                                boardItem.quantity -= boardItem.preQuantity
                                boardItems.push(boardItem)
                            }
                        }

                        savedBoard.boardItems = boardItems
                        savedBoard.table = table
                        savedBoard.user = this.user

                        switch (this.setting.papelImpresion) {
                            case 'ticket58mm':
                                this.printService.printCommand58mm(savedBoard)
                                break
                            default:
                                this.printService.printCommand80mm(savedBoard)
                                break
                        }

                    }
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/boards'])
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
        }
    }

}
