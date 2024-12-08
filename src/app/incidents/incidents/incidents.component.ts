import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { buildExcel } from '../../buildExcel';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PriceType } from '../../products/price-type.enum';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { DialogDetailIncidentsComponent } from '../dialog-detail-incidents/dialog-detail-incidents.component';
import { IncidentItemModel } from '../incident-item.model';
import { IncidentsService } from '../incidents.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-incidents',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './incidents.component.html',
    styleUrls: ['./incidents.component.sass'],
})
export class IncidentsComponent {

    constructor(
        private readonly incidentsService: IncidentsService,
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly activatedRoute: ActivatedRoute,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly matDialog: MatDialog,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: '',
        userId: '',
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    users: UserModel[] = []
    displayedColumns: string[] = ['created', 'product', 'quantity', 'reason', 'user', 'observations', 'actions']
    dataSource: IncidentItemModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
    private setting: SettingModel = new SettingModel()
    private params: Params = {}

    private handlePriceLists$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePriceLists$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Incidencias')

        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar excel', icon: 'download', show: false },
        ])

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const { startDate, endDate } = this.params
            if (startDate && endDate) {
                this.navigationService.loadBarStart()
                const chunk = 500
                const promises: Promise<any>[] = []

                for (let index = 0; index < this.length / chunk; index++) {
                    const promise = lastValueFrom(this.incidentsService.getIncidentItemsByPage(index + 1, chunk, this.params))
                    promises.push(promise)
                }

                Promise.all(promises).then(values => {
                    const incidentItems = values.flat() as IncidentItemModel[]

                    this.navigationService.loadBarFinish()

                    switch (this.setting.defaultPrice) {
                        case PriceType.GLOBAL:
                            // this.handleProducts$ = this.productsService.handleProducts().subscribe(products => {
                            //   this.products = products
                            // })
                            break
                        case PriceType.OFICINA:
                            for (const product of incidentItems.map(e => e.product)) {
                                const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId === null)
                                product.price = price ? price.price : product.price
                            }
                            // this.products = products
                            // this.handleProducts$ = this.productsService.handleProducts().subscribe(products => {
                            // })
                            break
                        case PriceType.LISTA:
                            // this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                            //   // this.priceLists = priceLists
                            //   this.priceListId = this.setting.defaultPriceListId || priceLists[0]?._id
                            //   this.handleProducts$ = this.productsService.handleProducts().subscribe(products => {
                            //     for (const product of products) {
                            //       const price = product.prices.find(e => e.priceListId === this.priceListId)
                            //       product.price = price ? price.price : product.price
                            //     }
                            //     this.products = products
                            //   })
                            // })
                            break
                        case PriceType.LISTAOFICINA:
                            // this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                            //   this.priceLists = priceLists
                            //   this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
                            //   this.handleProducts$ = this.productsService.handleProducts().subscribe(products => {
                            //     for (const product of products) {
                            //       const foundPrice = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                            //       if (foundPrice) {
                            //         product.price = foundPrice.price
                            //       } else {
                            //         const foundPrice = product.prices.find(e => e.officeId === this.office._id && e.priceListId === null)
                            //         product.price = foundPrice ? foundPrice.price : product.price
                            //       }
                            //     }
                            //     this.products = products
                            //   })
                            // })
                            break
                    }

                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    body.push([
                        'F. REGISTRO',
                        'H. REGISTRO',
                        'PRODUCTO',
                        'CANTIDAD',
                        'PRECIO',
                        'RAZON',
                        'USUARIO',
                        'OBSERVACIONES'
                    ])
                    for (const incidentItem of incidentItems) {
                        body.push([
                            formatDate(incidentItem.createdAt, 'dd/MM/yyyy', 'en-US'),
                            formatDate(incidentItem.createdAt, 'h:mm', 'en-US'),
                            incidentItem.fullName.toUpperCase(),
                            incidentItem.quantity,
                            incidentItem.product.price,
                            incidentItem.incident.incidentType,
                            incidentItem.user.name.toUpperCase()
                        ])
                    }
                    const name = `INCIDENCIAS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}`
                    buildExcel(body, name, wscols, [], [])
                })
            } else {
                this.navigationService.showDialogMessage('Seleccione un rango de fechas')
            }
        })

        const { pageIndex, pageSize, startDate, endDate } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)

        if (startDate && endDate) {
            const queryParams = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
            this.formGroup.patchValue(queryParams)
            Object.assign(this.params, queryParams)
        }

        this.fetchCount()
        this.fetchData()
    }

    onDetailIncident(incidentItemId: string) {
        this.matDialog.open(DialogDetailIncidentsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: incidentItemId,
        })
    }

    onUserChange() {
        const { userId } = this.formGroup.value

        const queryParams: Params = { userId }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        Object.assign(this.params, queryParams)

        this.fetchData()
        this.fetchCount()
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0

            const { startDate, endDate } = this.formGroup.value

            const queryParams: Params = { startDate: startDate, endDate: endDate, pageIndex: 0, key: null }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            Object.assign(this.params, queryParams)

            this.fetchData()
            this.fetchCount()
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart()
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.incidentsService.getIncidentItemsByPage(
            this.pageIndex + 1,
            this.pageSize,
            this.params
        ).subscribe(incidentItems => {
            console.log(incidentItems)
            this.navigationService.loadBarFinish()
            this.dataSource = incidentItems
        })
    }

    fetchCount() {
        this.incidentsService.getCountIncidentItems(this.params).subscribe(count => {
            this.length = count
        })
    }

    onOpenDetails(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onDeleteIncident(incidentId: string, incidentItemId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.incidentsService.deleteIncidentItem(incidentId, incidentItemId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
                this.fetchCount()
            })
        }
    }

}
