import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
import { buildExcel } from '../../buildExcel';
import { CustomersService } from '../../customers/customers.service';
import { SummaryCustomerSaleModel } from '../../customers/summary-customer-sale.model';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-customers',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.sass']
})
export class CustomersComponent {

    constructor(
        private readonly customersService: CustomersService,
        private readonly categoriesService: CategoriesService,
        private readonly navigationService: NavigationService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
    ) { }

    @ViewChild(MatSort) sort: MatSort = new MatSort()
    displayedColumns: string[] = ['customer', 'countSale', 'totalSale']
    dataSource: MatTableDataSource<SummaryCustomerSaleModel> = new MatTableDataSource()
    formGroup: FormGroup = this.formBuilder.group({
        categoryId: '',
        userId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    chart: Chart | null = null
    categoryId: string = ''
    categories: CategoryModel[] = []
    totalCountSale: number = 0
    totalTotalSale: number = 0
    summaryCustomerSales: SummaryCustomerSaleModel[] = []
    users: UserModel[] = []
    @ViewChild('incomesChart')
    private incomesChart!: ElementRef<HTMLCanvasElement>

    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleUsers$.unsubscribe()
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

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const { startDate, endDate } = this.formGroup.value

            let wscols = [20, 20, 50, 50, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'T. DOCUMENTO',
                'DOCUMENTO',
                'NOMBRES',
                'DIRECCION',
                'CELULAR',
                'EMAIL',
                'T. VENTAS',
                'C. VENTAS',
                'USUARIO'
            ])
            for (const summaryCustomerSale of this.summaryCustomerSales) {
                body.push([
                    summaryCustomerSale.documentType,
                    summaryCustomerSale.document,
                    summaryCustomerSale.name.toUpperCase(),
                    (summaryCustomerSale.address || '').toUpperCase(),
                    summaryCustomerSale.mobileNumber,
                    summaryCustomerSale.email,
                    summaryCustomerSale.totalSale,
                    summaryCustomerSale.countSale,
                ])
            }
            const name = `RANKIN_DE_CLIENTES_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}`
            buildExcel(body, name, wscols, [])
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

            this.customersService.getSummarySalesByRangeDateCustomers(
                startDate,
                endDate,
                params
            ).subscribe({
                next: summaryCustomerSale => {
                    this.navigationService.loadBarFinish()
                    this.summaryCustomerSales = summaryCustomerSale
                    this.dataSource = new MatTableDataSource(summaryCustomerSale)
                    this.dataSource.sort = this.sort
                    this.totalCountSale = summaryCustomerSale.map(e => e.countSale).reduce((a, b) => a + b, 0)
                    this.totalTotalSale = summaryCustomerSale.map(e => e.totalSale).reduce((a, b) => a + b, 0)
                    const data = {
                        datasets: [
                            {
                                label: 'Dataset 1',
                                data: summaryCustomerSale.slice(0, 10).map(e => e.totalSale || 0),
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
