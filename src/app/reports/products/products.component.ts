import { CommonModule, formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
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
    selector: 'app-products',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.sass']
})
export class ProductsComponent {

    constructor(
        private readonly salesService: SalesService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly categoriesService: CategoriesService,
        private readonly navigationService: NavigationService,
        private readonly officesService: OfficesService,
        private readonly authService: AuthService,
    ) { }

    @ViewChild('chargeChart')
    private chargeChart!: ElementRef<HTMLCanvasElement>
    @ViewChild('quantityChart')
    private quantityChart!: ElementRef<HTMLCanvasElement>

    formGroup: FormGroup = this.formBuilder.group({
        categoryId: '',
        userId: '',
        officeId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    displayedColumns: string[] = ['product', 'quantity', 'price', 'cost', 'charge', 'totalCost', 'utility', 'stock']
    dataSource: SummarySaleItemModel[] = []
    categoryId: string = ''
    categories: CategoryModel[] = []
    summarySaleItems: SummarySaleItemModel[] = []
    users: UserModel[] = []
    offices: OfficeModel[] = []
    totalQuantity: number = 0
    totalSale: number = 0
    private chargeChartRef: Chart | null = null
    private quantityChartRef: Chart | null = null

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
        this.navigationService.setMenu([
            // { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleOffices$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
            this.offices = offices
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const { startDate, endDate } = this.formGroup.value

            let wscols = [50, 50, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'PRODUCTO',
                'CODIGO INTERNO',
                'CODIGO FABRICANTE',
                'CATEGORIA',
                'UNIDADES',
                'PRECIO UNITARIO',
                'COSTO UNITARIO',
                'VENTA TOTAL',
                'COSTO TOTAL',
                'UTILIDAD',
                'STOCK',
            ])
            
            this.summarySaleItems.forEach(summarySaleItem => {
                body.push([
                    summarySaleItem.fullName.toUpperCase(),
                    summarySaleItem.sku,
                    summarySaleItem.upc,
                    this.categories.find(e => e._id === summarySaleItem.categoryId)?.name.toUpperCase(),
                    summarySaleItem.totalQuantity,
                    Number((summarySaleItem.totalSale / summarySaleItem.totalQuantity).toFixed(2)),
                    summarySaleItem.cost,
                    summarySaleItem.totalSale,
                    summarySaleItem.totalQuantity * (summarySaleItem.cost || 0),
                    summarySaleItem.totalSale - summarySaleItem.totalPurchase,
                    summarySaleItem.stock,
                ])
            })

            const name = `PRODUCTOS_VENDIDOS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}`
            buildExcel(body, name, wscols, [])
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.formGroup.patchValue({ officeId: auth.office._id })
            this.fetchData()
        })
    }

    formatInteger(charge: number): string {
        if (Number.isInteger(charge)) {
            return charge.toString()
        } else {
            return charge.toFixed(2)
        }
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()

            this.chargeChartRef?.destroy()
            this.quantityChartRef?.destroy()

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
                const colors = summarySaleItems.map(() => randomColor())
                this.summarySaleItems = summarySaleItems
                this.dataSource = summarySaleItems

                this.totalSale = summarySaleItems.map(e => e.totalSale).reduce((a, b) => a + b, 0)
                this.totalQuantity = summarySaleItems.map(e => e.totalQuantity).reduce((a, b) => a + b, 0)

                const dataCharge = {
                    // labels: ['Ene', 'Feb', 'Mar'],
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: summarySaleItems.slice(0, 10).map(e => e.totalSale || 0),
                            // borderColor: '#3f51b5',
                            backgroundColor: colors,
                            fill: true
                        },
                    ]
                }

                const dataQuantity = {
                    // labels: ['Ene', 'Feb', 'Mar'],
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: summarySaleItems.slice(0, 10).map(e => e.totalQuantity || 0),
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

                const configQuantity = {
                    type: 'pie' as ChartType,
                    data: dataQuantity,
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
                this.quantityChartRef = new Chart(this.quantityChart.nativeElement, configQuantity)
            })
        }
    }

    onOfficeChange() {
        this.fetchData()
    }

    onCategoryChange() {
        this.fetchData()
    }

    onUserChange() {
        this.fetchData()
    }

    onRangeChange() {
        this.fetchData()
    }

}
