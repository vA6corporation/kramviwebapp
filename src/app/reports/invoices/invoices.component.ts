import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType, Colors } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { ReportsService } from '../reports.service';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../sales/sales.service';
import { SummarySaleModel } from '../../invoices/summary-sale.model';
Chart.register(Colors)

@Component({
    selector: 'app-invoices',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.sass']
})
export class InvoicesComponent {

    constructor(
        // private readonly reportsService: ReportsService,
        private readonly salesService: SalesService,
        private readonly formBuilder: FormBuilder,
        private readonly categoriesService: CategoriesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    displayedColumns: string[] = ['_id', 'quantity', 'base', 'igv', 'charge']
    dataSource: SummarySaleModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    chart: Chart | null = null
    categoryId: string = ''
    categories: CategoryModel[] = []
    offices: OfficeModel[] = []
    officeId: string = ''
    users: UserModel[] = []
    userId: string = ''
    invoices: any[] = []
    totalQuantity: number = 0
    totalBase: number = 0
    totalIgv: number = 0
    totalCharge: number = 0
    private params: Params = { officeId: this.officeId }
    @ViewChild('incomesChargeChart')
    private incomesChargeChart!: ElementRef<HTMLCanvasElement>

    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleOffices$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.officeId = auth.office._id
            Object.assign(this.params, { officeId: this.officeId })
            this.fetchData()
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.chart?.destroy()
            const { startDate, endDate } = this.formGroup.value
            Object.assign(this.params, { startDate, endDate })
            this.navigationService.loadBarStart()
            this.salesService.getSummarySales(this.params).subscribe(summaryInvoices => {
                this.navigationService.loadBarFinish()
                this.invoices = summaryInvoices
                this.dataSource = summaryInvoices
                this.totalQuantity = summaryInvoices.map(e => e.quantity).reduce((a, b) => a + b, 0)
                this.totalCharge = summaryInvoices.map(e => e.charge).reduce((a, b) => a + b, 0)
                this.totalIgv = summaryInvoices.map(e => e.igv).reduce((a, b) => a + b, 0)
                this.totalBase = this.totalCharge - this.totalIgv
                const data = {
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: summaryInvoices.map((e: any) => e.charge),
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
                                backgroundColor: function (ctx) {
                                    return 'rgba(73, 79, 87, 0.5)'
                                },
                                borderRadius: 4,
                                color: 'white',
                                font: {
                                    weight: 'bold'
                                },
                                formatter: (value, ctx) => {
                                    return this.invoices[ctx.dataIndex]._id
                                },
                                padding: 6
                            },
                        }
                    } as ChartOptions,
                }
                const canvas = this.incomesChargeChart.nativeElement
                this.chart = new Chart(canvas, config)
            })
        }
    }

    onRangeChange() {
        this.fetchData()
    }

    onChangeOffice() {
        Object.assign(this.params, { officeId: this.officeId })
        this.fetchData()
    }

    onChangeUser() {
        Object.assign(this.params, { userId: this.userId })
        this.fetchData()
    }

}