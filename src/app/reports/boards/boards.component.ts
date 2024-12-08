import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { BoardsService } from '../../boards/boards.service';
import { SummaryBoardModel } from '../../boards/summary-board.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoryModel } from '../../products/category.model';
import { randomColor } from '../../randomColor';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';

@Component({
    selector: 'app-boards',
    imports: [MaterialModule, CommonModule, ReactiveFormsModule],
    templateUrl: './boards.component.html',
    styleUrl: './boards.component.sass'
})
export class BoardsComponent {

    constructor(
        private readonly boardsService: BoardsService,
        private readonly navigationService: NavigationService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
    ) { }

    @ViewChild(MatSort) sort: MatSort = new MatSort()
    displayedColumns: string[] = ['name', 'countSale', 'totalSale']
    dataSource: MatTableDataSource<SummaryBoardModel> = new MatTableDataSource()
    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    chart: Chart | null = null
    categoryId: string = ''
    categories: CategoryModel[] = []
    totalCountSale: number = 0
    totalTotalSale: number = 0
    summaryBoards: SummaryBoardModel[] = []
    users: UserModel[] = []
    @ViewChild('incomesChart')
    private incomesChart!: ElementRef<HTMLCanvasElement>

    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleUsers$.unsubscribe()
    }

    ngOnInit() {
        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })
    }

    ngAfterViewInit() {
        this.fetchData()
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.chart?.destroy()
            const { startDate, endDate, categoryId, userId } = this.formGroup.value
            const params: Params = { categoryId, userId }

            this.boardsService.getSummaryBoardsByRangeDate(
                startDate,
                endDate,
            ).subscribe({
                next: summaryBoards => {
                    console.log(summaryBoards)
                    this.navigationService.loadBarFinish()
                    const colors = summaryBoards.map(() => randomColor())
                    this.summaryBoards = summaryBoards
                    this.dataSource = new MatTableDataSource(summaryBoards)
                    this.dataSource.sort = this.sort
                    this.totalCountSale = summaryBoards.map(e => e.countSale).reduce((a, b) => a + b, 0)
                    this.totalTotalSale = summaryBoards.map(e => e.totalSale).reduce((a, b) => a + b, 0)
                    const data = {
                        datasets: [
                            {
                                label: 'Dataset 1',
                                data: summaryBoards.slice(0, 10).map(e => e.totalSale || 0),
                                backgroundColor: colors,
                                fill: true
                            },
                        ]
                    }

                    const config = {
                        type: 'pie' as ChartType,
                        data: data,
                        plugins: [ChartDataLabels],
                        options: {
                            maintainAspectRatio: false,
                            plugins: {
                                datalabels: {
                                    backgroundColor: function (context) {
                                        return 'rgba(73, 79, 87, 0.5)'
                                    },
                                    borderRadius: 4,
                                    color: 'white',
                                    font: {
                                        weight: 'bold'
                                    },
                                    formatter: function (value) {
                                        if (value === 0) {
                                            return null
                                        } else {
                                            return Math.round(value)
                                        }
                                    },
                                    padding: 6
                                },
                            }
                        } as ChartOptions,
                    }
                    const canvas = this.incomesChart.nativeElement
                    this.chart = new Chart(canvas, config)
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onChangeCategory() {
        this.fetchData()
    }

    onChangeUser() {
        this.fetchData()
    }

    onRangeChange() {
        this.fetchData()
    }

    onChange() {
        this.fetchData()
    }

}
