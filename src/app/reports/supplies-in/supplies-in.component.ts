import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoryModel } from '../../products/category.model';
import { randomColor } from '../../randomColor';
import { ReportsService } from '../reports.service';
import { MaterialModule } from '../../material.module';
Chart.register(...registerables);

@Component({
    selector: 'app-supplies-in',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './supplies-in.component.html',
    styleUrls: ['./supplies-in.component.sass']
})
export class SuppliesInComponent implements OnInit {

    constructor(
        private readonly authService: AuthService,
        private readonly reportsService: ReportsService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        officeId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    chart: Chart | null = null
    categoryId: string = ''
    categories: CategoryModel[] = []
    supplyItems: any[] = []
    colors: string[] = []
    offices: OfficeModel[] = []
    @ViewChild('incomesChart')
    private incomesChart!: ElementRef<HTMLCanvasElement>

    private handleClickMenu$: Subscription = new Subscription()
    private categories$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.categories$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleOffices$.unsubscribe()
    }

    ngOnInit() {
        this.navigationService.setMenu([
            // { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.formGroup.patchValue({ officeId: auth.office._id })
        })

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
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
            this.supplyItems.forEach(item => {
                body.push([
                    item.fullName.toUpperCase(),
                    (item.categoryName || '').toUpperCase(),
                    item.sales,
                ])
            })
            const name = `PRODUCTOS_VENDIDOS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}`
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
            const { startDate, endDate, officeId } = this.formGroup.value
            const params: Params = {
                startDate, endDate, officeId
            }
            this.reportsService.getSummarySuppliesIn(
                params
            ).subscribe(supplyItems => {
                this.navigationService.loadBarFinish()
                console.log(supplyItems)
                this.colors = supplyItems.map(() => randomColor())
                this.supplyItems = supplyItems
                this.supplyItems.sort((a, b) => {
                    if (a.totalCost < b.totalCost) {
                        return 1
                    }
                    if (a.totalCost > b.totalCost) {
                        return -1
                    }
                    return 0
                })
                const data = {
                    labels: supplyItems.slice(0, 10).map(e => e.name),
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: supplyItems.slice(0, 10).map(e => e.totalCost || 0),
                            // borderColor: '#3f51b5',
                            backgroundColor: this.colors,
                            fill: true
                        },
                    ]
                }

                const config = {
                    type: 'pie' as ChartType,
                    data: data,
                    options: {
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                        }
                    } as ChartOptions,
                }
                const canvas = this.incomesChart.nativeElement
                this.chart = new Chart(canvas, config)
            })
        }
    }

    onChangeCategory() {
        this.fetchData()
    }

    onChangeUser() {
        this.fetchData()
    }

    onOfficeChange() {
        this.fetchData()
    }

    onRangeChange() {
        this.fetchData()
    }

    onChange() {
        this.fetchData()
    }

}