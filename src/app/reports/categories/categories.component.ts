import { CommonModule, formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { randomColor } from '../../randomColor';
import { SalesService } from '../../sales/sales.service';
import { SummarySaleItemModel } from '../../sales/summary-sale-item.model';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { MaterialModule } from '../../material.module';
Chart.register(...registerables);

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent {

    constructor(
        private readonly salesService: SalesService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly categoriesService: CategoriesService,
        private readonly navigationService: NavigationService,
    ) { }

    @ViewChild('chargeChart')
    private chargeChart!: ElementRef<HTMLCanvasElement>

    formGroup: FormGroup = this.formBuilder.group({
        categoryId: '',
        userId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    categoryId: string = ''
    categories: CategoryModel[] = []
    summarySaleItems: SummarySaleItemModel[] = []
    filterCategories: any[] = []
    users: UserModel[] = []
    private chargeChartRef: Chart | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleUsers$.unsubscribe()
    }

    ngOnInit() {
        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
            this.fetchData()
        })

        this.navigationService.setMenu([
            // { id: 'search', label: 'Buscar', icon: 'search', show: true },
            // { id: 'excel_simple', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
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
            this.summarySaleItems.forEach(summarySaleItem => {
                body.push([
                    summarySaleItem.fullName.toUpperCase(),
                    this.categories.find(e => e._id === summarySaleItem.categoryId)?.name.toUpperCase(),
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

            const { startDate, endDate, categoryId, userId } = this.formGroup.value
            const params: Params = { categoryId, userId }

            this.salesService.getSummarySaleItemsByRangeDate(
                startDate,
                endDate,
                params
            ).subscribe(summarySaleItems => {
                this.navigationService.loadBarFinish()
                const colors = summarySaleItems.map(() => randomColor())
                this.summarySaleItems = summarySaleItems
                const filterCategories: any[] = []

                for (const category of this.categories) {
                    filterCategories.push({
                        ...category,
                        totalCharge: this.summarySaleItems.filter(e => e.categoryId === category._id).map(e => e.totalSale || 0).reduce((a, b) => a + b, 0),
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

                this.filterCategories = filterCategories.filter(e => e.totalCharge)

                const dataCharge = {
                    // labels: ['Ene', 'Feb', 'Mar'],
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: this.filterCategories.slice(0, 100).map(e => e.totalCharge || 0),
                            // borderColor: '#3f51b5',
                            backgroundColor: colors,
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
                                        return Math.round(value)
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
