import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { ProformaModel } from '../../proformas/proforma.model';
import { ProformasService } from '../../proformas/proformas.service';
import { SummaryProformaModel } from '../../proformas/summary-proforma.model';
import { randomColor } from '../../randomColor';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
Chart.register(...registerables);

@Component({
    selector: 'app-proformas',
    templateUrl: './proformas.component.html',
    styleUrls: ['./proformas.component.sass']
})
export class ProformasComponent implements OnInit {

    constructor(
        private readonly proformasService: ProformasService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly categoriesService: CategoriesService,
        private readonly navigationService: NavigationService,
    ) { }

    @ViewChild('chargeChart')
    private chargeChart!: ElementRef<HTMLCanvasElement>;

    formGroup: FormGroup = this.formBuilder.group({
        isBilled: '',
        userId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    });
    categoryId: string = ''
    categories: CategoryModel[] = []
    summaryProformas: SummaryProformaModel[] = []
    users: UserModel[] = []
    totalCharge: number = 0
    private chargeChartRef: Chart | null = null
    private quantityChartRef: Chart | null = null
    private office: OfficeModel = new OfficeModel()
    private business: BusinessModel = new BusinessModel()

    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
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

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const chunk = 500
            const { startDate, endDate, userId, isBilled } = this.formGroup.value
            const params: Params = { userId, isBilled }
            const promises: Promise<any>[] = []
            this.navigationService.loadBarStart()
            this.proformasService.getCountProformasByRangeDate(startDate, endDate, params).subscribe(count => {
                for (let index = 0; index < count / chunk; index++) {
                    const promise = lastValueFrom(this.proformasService.getProformasByRangeDatePage(startDate, endDate, index + 1, chunk, params))
                    promises.push(promise)
                }
                Promise.all(promises).then(values => {
                    this.navigationService.loadBarFinish()
                    const proformas = values.flat() as ProformaModel[]
                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    body.push([
                        'F. DE REGISTRO',
                        'H. DE REGISTRO',
                        'CLIENTE',
                        'RUC/DNI/CE',
                        'COMPROBANTE',
                        'Nº COMPROBANTE',
                        'TOTAL',
                        'USUARIO',
                        'ANULADO',
                        'OBSERVACIONES'
                    ])
                    for (const proforma of proformas) {
                        const { customer, sale } = proforma
                        body.push([
                            formatDate(proforma.createdAt, 'dd/MM/yyyy', 'en-US'),
                            formatDate(proforma.createdAt, 'hh:mm a', 'en-US'),
                            (customer?.name || 'VARIOS').toUpperCase(),
                            customer?.documentType,
                            sale ? sale.invoiceType : '',
                            sale ? `${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}` : '',
                            Number(proforma.charge.toFixed(2)),
                            proforma.user.name.toUpperCase(),
                            proforma.deletedAt ? 'SI' : 'NO',
                            proforma.observations
                        ])
                    }
                    const name = `PROFORMAS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}_${this.office.name.replace(/ /g, '_')}_RUC_${this.business.ruc}`
                    buildExcel(body, name, wscols, [])
                })
            })
        })
    }

    ngAfterViewInit() {
        this.fetchData()
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()

            this.chargeChartRef?.destroy()
            this.quantityChartRef?.destroy()

            const { startDate, endDate, userId, isBilled } = this.formGroup.value
            const params: Params = { userId, isBilled }

            this.proformasService.getSummaryProformasByRangeDateWorkers(
                startDate,
                endDate,
                params
            ).subscribe(summaryProformas => {
                this.navigationService.loadBarFinish()
                const colors = summaryProformas.map(() => randomColor())
                this.summaryProformas = summaryProformas
                this.totalCharge = summaryProformas.map(e => e.totalCharge).reduce((a, b) => a + b, 0)

                const dataCharge = {
                    // labels: ['Ene', 'Feb', 'Mar'],
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: summaryProformas.slice(0, 10).map(e => e.totalCharge || 0),
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
                            data: summaryProformas.slice(0, 10).map(e => e.totalCharge || 0),
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

    onIsBilledChange() {
        this.fetchData()
    }

    onChange() {
        this.fetchData()
    }

}
