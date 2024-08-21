import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { randomColor } from '../../randomColor';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { ReportsService } from '../reports.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-invoices',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.sass']
})
export class InvoicesComponent implements OnInit {

    constructor(
        private readonly reportsService: ReportsService,
        private readonly formBuilder: FormBuilder,
        private readonly categoriesService: CategoriesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    displayedColumns: string[] = ['_id', 'quantity', 'charge']
    dataSource: UserModel[] = []
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
    colors: string[] = []
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
            this.reportsService.getSummaryInvoicesByRangeDateOfficeUser(this.params).subscribe(summaryInvoices => {
                this.navigationService.loadBarFinish()
                this.colors = summaryInvoices.map(() => randomColor())
                this.invoices = summaryInvoices
                this.dataSource = summaryInvoices
                const data = {
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: summaryInvoices.map((e: any) => e.charge),
                            backgroundColor: this.colors,
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
                                    // return context.dataset.backgroundColor
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