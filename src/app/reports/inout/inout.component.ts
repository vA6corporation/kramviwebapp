import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { ReportsService } from '../reports.service';

@Component({
    selector: 'app-inout',
    imports: [MaterialModule, CommonModule],
    templateUrl: './inout.component.html',
    styleUrls: ['./inout.component.sass']
})
export class InoutComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly reportsService: ReportsService,
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @ViewChild('incomesChart') incomesChart!: ElementRef<HTMLCanvasElement>
    years: number[] = []
    year: number = new Date().getFullYear()
    offices: OfficeModel[] = []
    officeId: string = ''
    users: UserModel[] = []
    userId: string = ''
    private chart: Chart | null = null
    private months: string[] = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
    ]
    displayedColumns: string[] = ['month', 'sales', 'purchases', 'final']
    dataSource: any[] = []
    private params: Params = {}

    private handleAuth$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleOffices$.unsubscribe()
    }

    ngOnInit() {
        const startYear = 2020
        const currentYear = new Date().getFullYear()

        for (let index = startYear; index <= currentYear; index++) {
            this.years.push(index)
        }

        this.navigationService.setMenu([])

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.officeId = auth.office._id
            Object.assign(this.params, { officeId: this.officeId })
            this.fetchData()
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.reportsService.getInOutByYearOfficeUser(this.year, this.params).subscribe(res => {
            this.navigationService.loadBarFinish()
            this.chart?.destroy()
            const { sales, purchases, purchaseSupplies, paymentOrders } = res
            const dataSource = []

            for (let index = 0; index < 12; index++) {
                const sale = sales[index]
                const purchase = purchases[index]
                const purchaseSupply = purchaseSupplies[index]
                const paymentOrder = paymentOrders[index]

                const data: any = {}

                data.month = this.months[index]

                if (sale.mes === index + 1) {
                    data.sale = sale.total
                }

                if (purchase.mes === index + 1) {
                    data.purchase = purchase.total
                }

                if (purchaseSupply.mes === index + 1) {
                    data.purchaseSupply = purchaseSupply.total
                }

                if (paymentOrder.mes === index + 1) {
                    data.paymentOrder = paymentOrder.total
                }

                dataSource.push(data)
            }
            
            if (purchaseSupplies.map((e: any) => e.total).reduce((a: any, b: any) => a + b, 0)) {
                this.displayedColumns.splice(3, 0, 'purchaseSupplies')
            }

            if (paymentOrders.map((e: any) => e.total).reduce((a: any, b: any) => a + b, 0)) {
                this.displayedColumns.splice(3, 0, 'paymentOrders')
            }

            this.dataSource = dataSource

            const data = {
                labels: this.months,
                datasets: [
                    {
                        label: 'Ventas',
                        data: sales.map((e: any) => e.total),
                        fill: true,
                        datalabels: {
                            align: 'end',
                            anchor: 'end'
                        } as any
                    },
                    {
                        label: 'Compras',
                        data: purchases.map((e: any) => e.total),
                        fill: true,
                        datalabels: {
                            align: 'start',
                            anchor: 'start'
                        } as any
                    },
                    {
                        label: 'Insumos',
                        data: purchaseSupplies.map((e: any) => e.total),
                        fill: true,
                        datalabels: {
                            align: 'start',
                            anchor: 'start'
                        } as any
                    },
                    {
                        label: 'Ordenes de pago',
                        data: paymentOrders.map((e: any) => e.total),
                        fill: true,
                        datalabels: {
                            align: 'start',
                            anchor: 'start'
                        } as any
                    },
                ]
            }

            const config = {
                type: 'line' as ChartType,
                data: data,
                plugins: [ChartDataLabels],
                options: {
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
                                    return Math.round(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }
                            },
                            padding: 6
                        }
                    },
                    aspectRatio: 5 / 3,
                    layout: {
                        padding: {
                            top: 32,
                            right: 16,
                            bottom: 16,
                            left: 8
                        }
                    },
                    maintainAspectRatio: false,
                } as ChartOptions,
            }

            const canvas = this.incomesChart.nativeElement
            this.chart = new Chart(canvas, config)
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message)
        })
    }

    onChange() {
        Object.assign(this.params, {
            officeId: this.officeId,
            userId: this.userId
        })
        this.fetchData()
    }
}
