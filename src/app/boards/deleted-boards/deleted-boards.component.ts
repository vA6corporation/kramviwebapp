import { Component, inject, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { DialogDetailSalesComponent } from '../../sales/dialog-detail-sales/dialog-detail-sales.component'
import { NavigationService } from '../../navigation/navigation.service'
import { PrintService } from '../../print/print.service'
import { BoardModel } from '../board.model'
import { BoardsService } from '../boards.service'
import { DialogVersionBoardsComponent } from '../dialog-version-boards/dialog-version-boards.component'
import { TablesService } from '../../tables/tables.service'
import { TableModel } from '../../tables/table.model'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-deleted-boards',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './deleted-boards.component.html',
    styleUrls: ['./deleted-boards.component.sass']
})
export class DeletedBoardsComponent {

    private readonly matDialog = inject(MatDialog)
    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly boardsService = inject(BoardsService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)
    private readonly printService = inject(PrintService)
    private readonly tablesService = inject(TablesService)

    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        tableId: '',
    })
    displayedColumns: string[] = ['createdAt', 'ticketNumber', 'boardNumber', 'sale', 'user', 'charge', 'deletedBoardItems', 'preaccountsCount', 'observation', 'actions']
    $dataSource = signal<BoardModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $tables = signal<TableModel[]>([])
    office: OfficeModel = new OfficeModel()
    private setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()
    private handleTables$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleTables$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Comandas')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
        })

        const { startDate, endDate, pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams

        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)

        if (startDate && endDate) {
            this.formGroup.patchValue({
                startDate: new Date(startDate),
                endDate: new Date(startDate),
            })
        }

        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            this.$tables.set(tables)
        })

        this.fetchData()
        this.fetchCount()
    }

    fetchCount() {
        const { startDate, endDate, tableId } = this.formGroup.value
        const params: Params = { startDate, endDate, tableId }
        this.boardsService.getCountBoards(params).subscribe(count => {
            this.$length.set(count)
        })
    }

    fetchData() {
        const { startDate, endDate, tableId } = this.formGroup.value
        const params: Params = { startDate, endDate, tableId }
        this.navigationService.loadBarStart()
        this.boardsService.getBoardsByPage(this.pageIndex + 1, this.pageSize, params).subscribe(boards => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(boards)
        })
    }

    onPrint(boardId: any) {
        this.boardsService.getBoardById(boardId).subscribe(board => {
            switch (this.setting.defaultTicket) {
                case '80MM':
                    this.printService.printCommand80mm(board)
                    break
                default:
                    this.printService.printCommand58mm(board)
                    break
            }
        })
    }

    onFilterChange() {
        this.fetchData()
        this.fetchCount()
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0
            const { startDate, endDate } = this.formGroup.value

            const queryParams: Params = { startDate, endDate, pageIndex: 0 }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()
            this.fetchCount()
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
    }

    onOpenHistory(boardId: any) {
        this.matDialog.open(DialogVersionBoardsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: boardId,
        })
    }

    onOpenSale(saleId: any) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

}
