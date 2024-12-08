import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { BoardModel } from '../board.model';
import { BoardsService } from '../boards.service';
import { DialogVersionBoardsComponent } from '../dialog-version-boards/dialog-version-boards.component';
import { TablesService } from '../../tables/tables.service';
import { TableModel } from '../../tables/table.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-deleted-boards',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './deleted-boards.component.html',
    styleUrls: ['./deleted-boards.component.sass']
})
export class DeletedBoardsComponent {

    constructor(
        private readonly boardsService: BoardsService,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
        private readonly tablesService: TablesService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        filterCommands: false,
        tableId: '',
    })
    displayedColumns: string[] = ['createdAt', 'ticketNumber', 'boardNumber', 'sale', 'user', 'charge', 'deletedBoardItems', 'deletedObservations', 'actions']
    dataSource: BoardModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    tables: TableModel[] = []
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()

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
                startDate: new Date(Number(startDate)),
                endDate: new Date(Number(startDate)),
            })
        }

        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            this.tables = tables
        })

        this.fetchData()
        this.fetchCount()
    }

    fetchCount() {
        const { startDate, endDate, filterCommands, tableId } = this.formGroup.value
        const params: Params = { filterCommands, startDate, endDate, tableId }
        this.boardsService.getCountBoards(params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        const { startDate, endDate, filterCommands, tableId } = this.formGroup.value
        const params: Params = { filterCommands, startDate, endDate, tableId }
        this.navigationService.loadBarStart()
        this.boardsService.getBoardsByPage(this.pageIndex + 1, this.pageSize, params).subscribe(boards => {
            this.navigationService.loadBarFinish()
            this.dataSource = boards
        })
    }

    onPrint(boardId: string) {
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

    onFilterChange() {
        this.fetchData()
        this.fetchCount()
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0
            const { startDate, endDate } = this.formGroup.value

            const queryParams: Params = { startDate: startDate.getTime(), endDate: endDate.getTime(), pageIndex: 0 }

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

    onOpenHistory(boardId: string) {
        this.matDialog.open(DialogVersionBoardsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: boardId,
        })
    }

    onOpenSale(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

}
