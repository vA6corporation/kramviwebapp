import { Component, ElementRef, ViewChild, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Params } from '@angular/router'
import { Chart, ChartOptions, ChartType, Colors } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../../users/users.service'
import { ReportsService } from '../reports.service'
import { CommonModule } from '@angular/common'
import { SalesService } from '../../sales/sales.service'
import { SummarySaleModel } from '../../sales/summary-sale.model'
import { ActivatedRoute, Router } from '@angular/router'
Chart.register(Colors)

@Component({
    selector: 'app-invoices',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.sass']
})
export class InvoicesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly router = inject(Router)
    private readonly salesService = inject(SalesService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)
    private readonly usersService = inject(UsersService)

    displayedColumns: string[] = ['id', 'quantity', 'base', 'igv', 'charge']
    dataSource: SummarySaleModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
        includeSaleNotes: false,
    })
    chart: Chart | null = null
    categoryId: string = ''
    categories: CategoryModel[] = []
    offices: OfficeModel[] = []
    officeId: number = 0
    users: UserModel[] = []
    userId: number = 0
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
            this.officeId = auth.office.id
            const { startDate, endDate } = this.activatedRoute.snapshot.queryParams
            if (startDate && endDate) {
                Object.assign(this.params, { startDate, endDate })
                this.formGroup.patchValue({
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                })
            }
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
            const { startDate, endDate, includeSaleNotes } = this.formGroup.value
            Object.assign(this.params, { startDate, endDate })
            this.navigationService.loadBarStart()
            this.salesService.getSummarySales(this.params).subscribe(summaryInvoices => {
               // let filterSummaryInvoices = Array.from(summaryInvoices)
               // if (!includeSaleNotes) { filterSummaryInvoices = filterSummaryInvoices.filter(e => e.id !== 'NOTA DE VENTA') }
               // this.navigationService.loadBarFinish()
               // this.invoices = filterSummaryInvoices
               // this.dataSource = filterSummaryInvoices
               // this.totalQuantity = filterSummaryInvoices.map(e => e.quantity).reduce((a, b) => a + b, 0)
               // this.totalCharge = filterSummaryInvoices.map(e => e.charge).reduce((a, b) => a + b, 0)
               // this.totalIgv = filterSummaryInvoices.map(e => e.igv).reduce((a, b) => a + b, 0)
               // this.totalBase = this.totalCharge - this.totalIgv
               // const data = {
               //     datasets: [
               //         {
               //             label: 'Dataset 1',
               //             data: filterSummaryInvoices.map((e: any) => e.charge),
               //                 fill: true
               //         },
               //     ]
               // }

               // const config = {
               //     type: 'pie' as ChartType,
               //     data: data,
               //     plugins: [ChartDataLabels],
               //     options: {
               //         maintainAspectRatio: false,
               //         plugins: {
               //             datalabels: {
               //                 backgroundColor: function (ctx) {
               //                     return 'rgba(73, 79, 87, 0.5)'
               //                 },
               //                 borderRadius: 4,
               //                 color: 'white',
               //                 font: {
               //                     weight: 'bold'
               //                 },
               //                 formatter: (value, ctx) => {
               //                     return this.invoices[ctx.dataIndex].id
               //                 },
               //                 padding: 6
               //             },
               //         }
               //     } as ChartOptions,
               // }
               // const canvas = this.incomesChargeChart.nativeElement
               // this.chart = new Chart(canvas, config)
            })
        }
    }

    onRangeChange() {
        const { startDate, endDate } = this.formGroup.value
        Object.assign(this.params, { startDate, endDate })
        const queryParams: Params = { startDate, endDate, pageIndex: 0, key: null }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

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
