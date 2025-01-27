import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { buildExcel } from '../../buildExcel';
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component';
import { NavigationService } from '../../navigation/navigation.service';
import { CustomerModel } from '../customer.model';
import { CustomersService } from '../customers.service';
import { DialogDetailCustomersComponent } from '../dialog-detail-customers/dialog-detail-customers.component';
import { MaterialModule } from '../../material.module';
import { DeletedCustomersComponent } from '../deleted-customers/deleted-customers.component';
import { DialogSearchProductsComponent } from '../../products/dialog-search-products/dialog-search-products.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-customers',
    imports: [MaterialModule, CommonModule, RouterModule, ReactiveFormsModule, DeletedCustomersComponent],
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.sass']
})
export class CustomersComponent {

    constructor(
        private readonly customersService: CustomersService,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: '',
    })
    displayedColumns: string[] = ['checked', 'document', 'name', 'creditLimit', 'mobileNumber', 'observations', 'actions']
    dataSource: CustomerModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    customerType: string = ''
    customerIds: string[] = []
    private params: Params = {}
    private business: BusinessModel = new BusinessModel()

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Clientes')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'export_excel', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'join_customers', label: 'Combinar clientes', icon: 'join_left', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            switch (id) {
                case 'join_customers': {
                    if (!this.customerIds.length) {
                        this.navigationService.showMessage('Selecciona almenos 2 clientes')
                        return
                    }
                    if (this.customerIds.length < 5) {
                        const ok = confirm('Estas seguro de combinar los clientes?...')
                        if (ok) {
                            this.navigationService.loadBarStart()
                            this.customersService.joinCustomers(this.customerIds).subscribe(() => {
                                this.navigationService.loadBarFinish()
                                this.fetchData()
                                this.fetchCount()
                            })
                        }
                    } else {
                        this.navigationService.showMessage('Solo puedes combinar maximo 4 clientes')
                    }
                    break
                }
                case 'export_excel': {
                    const chunk = 500
                    const customers: CustomerModel[] = []

                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.length / chunk
                    })

                    for (let index = 0; index < this.length / chunk; index++) {
                        const values = await lastValueFrom(this.customersService.getCustomersByPageWithLastSale(index + 1, chunk, this.params))
                        dialogRef.componentInstance.onComplete()
                        customers.push(...values)
                    }

                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    body.push([
                        'T. DOCUMENTO',
                        'DOCUMENTO',
                        'NOMBRES/R. SOCIAL',
                        'DIRECCION',
                        'EMAIL',
                        'CELULAR',
                        'ULT. PRODUCTO/SERVICIO',
                        'FECHA ULTIMA COMPRA'
                    ])
                    for (const customer of customers) {
                        const lastSale = customer.lastSale
                        let lastProduct = ''
                        let lastSaleAt = ''
                        if (lastSale && lastSale.saleItems) {
                            lastProduct = (lastSale.saleItems[0] || { fullName: '' }).fullName
                            lastSaleAt = formatDate(new Date(lastSale.createdAt), 'dd/MM/yyyy', 'en-US')
                        }
                        body.push([
                            customer.documentType,
                            customer.document,
                            customer.name.toUpperCase(),
                            customer.addresses[0],
                            customer.email,
                            customer.mobileNumber,
                            (lastProduct || '').toUpperCase(),
                            lastSaleAt,
                        ])
                    }
                    const name = `CLIENTES_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}_${this.business.businessName.replace(/ /g, '_').toUpperCase()}`
                    buildExcel(body, name, wscols, [])
                }
            }
        })

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.fetchData()
        this.fetchCount()

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.customersService.getCustomersByKey(key).subscribe({
                next: customers => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = customers
                },
                error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })
    }

    onChangeDocumentType() {
        const { documentType } = this.formGroup.value
        Object.assign(this.params, { documentType })
        this.fetchData()
        this.fetchCount()
    }

    onOpenDialogProducts() {
        const dialogRef = this.matDialog.open(DialogSearchProductsComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                Object.assign(this.params, { productId: product._id })
                this.fetchData()
                this.fetchCount()
            }
        })
    }

    onCheckAllCustomers(isChecked: boolean) {
        if (isChecked) {
            this.customerIds = this.dataSource.map(e => e._id)
        } else {
            this.customerIds = []
        }
    }

    onCheckCustomer(isChecked: boolean, customerId: string) {
        if (isChecked) {
            this.customerIds.push(customerId)
        } else {
            const index = this.customerIds.indexOf(customerId)
            if (index > -1) {
                this.customerIds.splice(index, 1)
            }
        }
    }

    onDialogDetailCustomer(customerId: string) {
        this.matDialog.open(DialogDetailCustomersComponent, {
            width: '600px',
            height: '600px',
            position: { top: '20px' },
            data: customerId,
        })
    }

    handlePageEvent(event: PageEvent): void {
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

    fetchCount() {
        this.customersService.getCountCustomers(this.params).subscribe(count => {
            this.length = count
        })
    }

    onChangeSelector() {
        this.pageIndex = 0
        this.fetchData()
        this.fetchCount()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        Object.assign(this.params, { customerType: this.customerType })
        this.customersService.getCustomersByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(customers => {
            this.navigationService.loadBarFinish()
            this.dataSource = customers
        })
    }

    onDelete(customerId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.customersService.delete(customerId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Eliminado correctamente')
                    this.fetchData()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}