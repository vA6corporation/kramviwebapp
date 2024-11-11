import { Component, ElementRef, ViewChild } from '@angular/core';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { PurchasesService } from '../../purchases/purchases.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-purchases',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './purchases.component.html',
    styleUrls: ['./purchases.component.sass']
})
export class PurchasesComponent {

    constructor(
        private readonly purchasesService: PurchasesService,
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
    private params: Params = { officeId: this.officeId }

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

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.officeId = auth.office._id
            this.fetchData()
        })

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })
    }

    fetchData() {
        this.chart?.destroy()

        this.purchasesService.getPurchasesByYearOfficeUser(
            this.year,
            this.params
        ).subscribe(purchases => {
            const data = {
                labels: [
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
                ],
                datasets: [
                    {
                        label: 'Compras',
                        data: purchases,
                        borderColor: '#e32929',
                        backgroundColor: 'rgba(227, 41, 41, 0.2)',
                        fill: true,
                        datalabels: {
                            align: 'end',
                            anchor: 'end'
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
