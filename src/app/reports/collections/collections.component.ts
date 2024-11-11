import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { ReportsService } from '../reports.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-collections',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.sass']
})
export class CollectionsComponent {

    constructor(
        private readonly reportsService: ReportsService,
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly navigationService: NavigationService,
    ) { }

    @ViewChild('incomesChart') incomesChart!: ElementRef<HTMLCanvasElement>
    years: number[] = []
    year: number = new Date().getFullYear()
    offices: OfficeModel[] = []
    officeId: string = ''
    users: UserModel[] = []
    userId: string = ''
    private chart: Chart | null = null
    private params: Params = {}
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
    displayedColumns: string[] = ['month', 'sales', 'purchases', 'paymentOrders', 'final']
    dataSource: any[] = []

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
        this.reportsService.getInOutByYearOfficeUser(
            this.year,
            this.params
        ).subscribe({
            next: res => {
                this.chart?.destroy()
                const { sales, purchases, paymentOrders } = res
                const dataSource = []

                for (let index = 0; index < 12; index++) {
                    const sale = sales.find((e: any) => e.mes === index + 1) || { total: 0, }
                    const purchase = purchases.find((e: any) => e.mes === index + 1) || { total: 0 }
                    const paymentOrder = paymentOrders.find((e: any) => e.mes === index + 1) || { total: 0 }

                    const data: any = {}

                    data.month = this.months[index]

                    if (sale.mes === index + 1) {
                        data.sale = sale.total
                    }

                    if (purchase.mes === index + 1) {
                        data.purchase = purchase.total
                    }

                    if (paymentOrder.mes === index + 1) {
                        data.paymentOrder = paymentOrder.total
                    }

                    dataSource.push(data)
                }

                this.dataSource = dataSource

                const data = {
                    labels: this.months,
                    datasets: [
                        {
                            label: 'Ventas',
                            data: sales.map((e: any) => e.total),
                            borderColor: '#3f51b5',
                            backgroundColor: 'rgba(63, 81, 181, 0.3)',
                            fill: true,
                            datalabels: {
                                align: 'end',
                                anchor: 'end'
                            } as any
                        },
                        {
                            label: 'Compras',
                            data: purchases.map((e: any) => e.total),
                            borderColor: '#e32929',
                            backgroundColor: 'rgba(227, 41, 41, 0.3)',
                            fill: true,
                            datalabels: {
                                align: 'start',
                                anchor: 'start'
                            } as any
                        },
                        {
                            label: 'Ordenes de pago',
                            data: paymentOrders.map((e: any) => e.total),
                            borderColor: '#ffff35',
                            backgroundColor: 'rgba(255, 255, 53, 0.3)',
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
                            }
                        },

                        // Core options
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
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
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
