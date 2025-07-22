import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { ReportsService } from '../../reports/reports.service';
import { UserModel } from '../../users/user.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-invoices',
    imports: [MaterialModule, CommonModule],
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.sass']
})
export class InvoicesComponent {

    constructor(
        private readonly reportsService: ReportsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
    ) { }

    @ViewChild('deliveryChart')
    private invoicesChart!: ElementRef<HTMLCanvasElement>
    chart: Chart | null = null
    summaryInvoices: any[] = []
    users: UserModel[] = []
    offices: OfficeModel[] = []
    officeId: string = ''
    month: number = new Date().getMonth()
    months: any[] = [
        { index: 0, label: 'ENERO' },
        { index: 1, label: 'FEBRERO' },
        { index: 2, label: 'MARZO' },
        { index: 3, label: 'ABRIL' },
        { index: 4, label: 'MAYO' },
        { index: 5, label: 'JUNIO' },
        { index: 6, label: 'JULIO' },
        { index: 7, label: 'AGOSTO' },
        { index: 8, label: 'SEPTIEMBRE' },
        { index: 9, label: 'OCTUBRE' },
        { index: 10, label: 'NOVIEMBRE' },
        { index: 11, label: 'DICIEMBRE' },
    ]

    private handleOffices$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleOffices$.unsubscribe()
    }

    ngOnInit() {
        this.navigationService.setMenu([
            // { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })
    }

    ngAfterViewInit() {
        this.fetchData()
    }

    onChange() {
        this.fetchData()
    }

    fetchData() {
        this.chart?.destroy()
        const startDate = new Date()
        startDate.setDate(1)
        startDate.setMonth(0)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(startDate)
        endDate.setFullYear(endDate.getFullYear() + 1)
        this.reportsService.getSummaryInvoicesByRangeDate({
            startDate,
            endDate,
            officeId: this.officeId,
        }).subscribe(summaryInvoices => {
            this.summaryInvoices = summaryInvoices
            const data = {
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: summaryInvoices.map((e: any) => e.charge),
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
                                if (value === 0) {
                                    return null
                                } else {
                                    let sum = 0
                                    let dataArr = ctx.chart.data.datasets[0].data
                                    dataArr.map((data: any) => {
                                        sum += data
                                    })
                                    let percentage = (value * 100 / sum).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"
                                    return `${this.summaryInvoices[ctx.dataIndex]._id}: ${percentage}`
                                }
                            },
                            padding: 6
                        },
                    }
                } as ChartOptions,
            }
            const canvas = this.invoicesChart.nativeElement
            this.chart = new Chart(canvas, config)
        })
    }

}
