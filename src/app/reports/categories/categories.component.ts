import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Params } from '@angular/router'
import { Chart, ChartOptions, ChartType } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Subscription } from 'rxjs'
import { buildExcel } from '../../buildExcel'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { SalesService } from '../../sales/sales.service'
import { SummarySaleItemModel } from '../../sales/summary-sale-item.model'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../../users/users.service'
import { AuthService } from '../../auth/auth.service'

@Component({
    selector: 'app-categories',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly salesService = inject(SalesService)
    private readonly usersService = inject(UsersService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)

    @ViewChild('chargeChart')
    private chargeChart!: ElementRef<HTMLCanvasElement>

    formGroup: FormGroup = this.formBuilder.group({
        categoryId: '',
        userId: '',
        officeId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    categoryId: string = ''
    $categories = signal<CategoryModel[]>([])
    $summarySaleItems = signal<SummarySaleItemModel[]>([])
    $filterCategories = signal<any[]>([])
    $users = signal<UserModel[]>([])
    private chargeChartRef: Chart | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.$categories.set(categories)
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.$users.set(users)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.formGroup.patchValue({ officeId: auth.office.id })
            this.fetchData()
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const { startDate, endDate } = this.formGroup.value

            let wscols = [50, 50, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'PRODUCTO',
                'CATEGORIA',
                'CANTIDAD',
            ])
            this.$summarySaleItems().forEach(summarySaleItem => {
                body.push([
                    summarySaleItem.fullName.toUpperCase(),
                    this.$categories().find(e => e.id === summarySaleItem.categoryId)?.name.toUpperCase(),
                    summarySaleItem.totalQuantity,
                ])
            })
            const name = `PRODUCTOS_VENDIDOS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}`
            buildExcel(body, name, wscols, [])
        })
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()

            this.chargeChartRef?.destroy()

            const { startDate, endDate, officeId, categoryId, userId } = this.formGroup.value

            const params: Params = {
                categoryId, userId, officeId
            }

            this.salesService.getSummarySaleItemsByRangeDate(
                startDate,
                endDate,
                params
            ).subscribe(summarySaleItems => {
                this.navigationService.loadBarFinish()
                this.$summarySaleItems.set(summarySaleItems)
                const filterCategories: any[] = []

                for (const category of this.$categories()) {
                    filterCategories.push({
                        ...category,
                        totalCharge: this.$summarySaleItems().filter(e => e.categoryId === category.id).map(e => e.totalCharge || 0).reduce((a, b) => a + b, 0),
                    })
                }

                filterCategories.sort((a, b) => {
                    if (a.totalCharge > b.totalCharge) {
                        return -1
                    }
                    if (a.totalCharge < b.totalCharge) {
                        return 1
                    }
                    return 0
                })

                this.$filterCategories.set(filterCategories.filter(e => e.totalCharge))

                const dataCharge = {
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: this.$filterCategories().slice(0, 100).map(e => e.totalCharge || 0),
                            fill: true
                        },
                    ]
                }

                const configCharge = {
                    type: 'pie' as ChartType,
                    data: dataCharge,
                    plugins: [ChartDataLabels],
                    options: {
                        maintainAspectRatio: false,
                        plugins: {
                            datalabels: {
                                backgroundColor: function (context) {
                                    return 'rgba(73, 79, 87, 0.5)'
                                    // return context.dataset.backgroundColor
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
                                        //return Math.round(value)
                                        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    }
                                },
                                padding: 6
                            },
                        }
                    } as ChartOptions,
                }
                this.chargeChartRef = new Chart(this.chargeChart.nativeElement, configCharge)
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
