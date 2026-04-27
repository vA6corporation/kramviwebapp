import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core'
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
import { InvoiceCode } from '../../sales/invoice-code.enum'
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
    $dataSource = signal<SummarySaleModel[]> ([])
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup = this.formBuilder.group({
        userId: 0,
        officeId: 0,
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
        includeSaleNotes: false,
    })
    chart: Chart | null = null
    categoryId: string = ''
    categories: CategoryModel[] = []
    $offices = signal<OfficeModel[]>([])
    $users = signal<UserModel[]>([])
    $summarySales = signal<any[]>([])
    $totalQuantity = signal<number>(0)
    $totalBase = signal<number>(0)
    $totalIgv = signal<number>(0)
    $totalCharge = signal<number>(0)
    private params: Params = {}
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
            this.formGroup.patchValue({ officeId: auth.office.id })
            const { startDate, endDate } = this.activatedRoute.snapshot.queryParams
            if (startDate && endDate) {
                Object.assign(this.params, { startDate, endDate })
                this.formGroup.patchValue({
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                })
            }
            Object.assign(this.params, { officeId: auth.office.id })
            this.fetchData()
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.$users.set(users)
        })

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.$offices.set(offices)
        })
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.chart?.destroy()
            const { startDate, endDate, includeSaleNotes } = this.formGroup.value
            Object.assign(this.params, { startDate, endDate })
            this.navigationService.loadBarStart()
                this.salesService.getSummarySales(this.params).subscribe(summarySales => {
                let filterSummarySales = Array.from(summarySales)
                if (!includeSaleNotes) { filterSummarySales = filterSummarySales.filter(e => e.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) }
                this.navigationService.loadBarFinish()
                this.$summarySales.set(filterSummarySales)
                this.$dataSource.set(filterSummarySales)
                this.$totalQuantity.set(filterSummarySales.map(e => e.totalQuantity).reduce((a, b) => a + b, 0))
                this.$totalCharge.set(filterSummarySales.map(e => e.totalCharge).reduce((a, b) => a + b, 0))
                this.$totalIgv.set(filterSummarySales.map(e => e.totalIgv).reduce((a, b) => a + b, 0))
                this.$totalBase.set(this.$totalCharge() - this.$totalIgv())

                const data = {
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: filterSummarySales.map((e: any) => e.totalCharge),
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
                                    return this.$summarySales()[ctx.dataIndex].invoiceName
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
        const { officeId } = this.formGroup.value
        Object.assign(this.params, { officeId })
        this.fetchData()
    }

    onChangeUser() {
        const { userId } = this.formGroup.value
        Object.assign(this.params, { userId })
        this.fetchData()
    }

}
