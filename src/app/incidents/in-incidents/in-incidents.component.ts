import { Component } from '@angular/core';
import { IncidentsService } from '../incidents.service';
import { NavigationService } from '../../navigation/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserModel } from '../../users/user.model';
import { IncidentItemModel } from '../incident-item.model';
import { OfficeModel } from '../../auth/office.model';
import { lastValueFrom, Subscription } from 'rxjs';
import { CommonModule, formatDate } from '@angular/common';
import { buildExcel } from '../../buildExcel';
import { DialogDetailIncidentsComponent } from '../dialog-detail-incidents/dialog-detail-incidents.component';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { MaterialModule } from '../../material.module';
import { PageEvent } from '@angular/material/paginator';
import { SheetIncidentsComponent } from '../sheet-incidents/sheet-incidents.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-in-incidents',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './in-incidents.component.html',
    styleUrl: './in-incidents.component.sass'
})
export class InIncidentsComponent {

    constructor(
        private readonly incidentsService: IncidentsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly bottomSheet: MatBottomSheet,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: '',
        userId: '',
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    users: UserModel[] = []
    displayedColumns: string[] = ['created', 'product', 'quantity', 'user', 'observations', 'actions']
    dataSource: IncidentItemModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
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
        this.navigationService.setTitle('Ajustes de inventario')

        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar excel', icon: 'download', show: false },
        ])

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const { startDate, endDate } = this.params
            if (startDate && endDate) {
                this.navigationService.loadBarStart()
                const chunk = 500
                const promises: Promise<any>[] = []

                for (let index = 0; index < this.length / chunk; index++) {
                    const promise = lastValueFrom(this.incidentsService.getIncidentInItemsByPage(index + 1, chunk, this.params))
                    promises.push(promise)
                }

                Promise.all(promises).then(values => {
                    const incidentItems = values.flat() as IncidentItemModel[]

                    this.navigationService.loadBarFinish()

                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    body.push([
                        'F. REGISTRO',
                        'H. REGISTRO',
                        'PRODUCTO',
                        'CANTIDAD',
                        'PRECIO',
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

    onCreateIncident() {
        this.bottomSheet.open(SheetIncidentsComponent)
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
        this.incidentsService.getIncidentInItemsByPage(
            this.pageIndex + 1,
            this.pageSize,
            this.params
        ).subscribe(incidentItems => {
            this.navigationService.loadBarFinish()
            this.dataSource = incidentItems
        })
    }

    fetchCount() {
        this.incidentsService.getCountIncidentInItems(this.params).subscribe(count => {
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
            this.incidentsService.deleteIncidentInItem(incidentId, incidentItemId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
                this.fetchCount()
            })
        }
    }

}
