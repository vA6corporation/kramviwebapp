import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { MaterialModule } from '../../material.module';
import { PurchaseSuppliesService } from '../../purchase-supplies/purchase-supplies.service';

@Component({
    selector: 'app-expenses',
    imports: [MaterialModule, CommonModule],
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.sass']
})
export class ExpensesComponent {

    constructor(
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
        private readonly authService: AuthService,
    ) { }

    @ViewChild('incomesChart') incomesChart!: ElementRef<HTMLCanvasElement>
    private chart: Chart | null = null
    year: number = new Date().getFullYear()
    offices: OfficeModel[] = []
    officeId: string = ''

    private handleOffices$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleOffices$.unsubscribe()
    }

    ngOnInit(): void {
        this.fetchData()

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })
    }

    onChange() {
        this.fetchData()
    }

    fetchData() {
        this.chart?.destroy()
        this.purchaseSuppliesService.getExpensesByYearOffice(this.year, this.officeId).subscribe(payments => {
            const data = {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [
                    {
                        // label: 'Recaudacion',
                        data: payments,
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
                        legend: {
                            display: false
                        },
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
                    // responsive: true,
                    aspectRatio: 3 / 1,
                    layout: {
                        padding: {
                            top: 30,
                            right: 0,
                            bottom: 0,
                            left: 0
                        }
                    },
                    maintainAspectRatio: true,
                } as ChartOptions,
            }

            const canvas = this.incomesChart.nativeElement
            this.chart = new Chart(canvas, config)
        })
    }

}
