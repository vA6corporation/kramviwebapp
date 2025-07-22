import { CommonModule, formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { SalesService } from '../../sales/sales.service';
import { SummarySaleItemModel } from '../../sales/summary-sale-item.model';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-utilities',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './utilities.component.html',
    styleUrls: ['./utilities.component.sass']
})
export class UtilitiesComponent {

    constructor(
        private readonly salesService: SalesService,
        private readonly officesService: OfficesService,
        private readonly categoriesService: CategoriesService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly usersService: UsersService,
    ) { }

    @ViewChild(MatSort) sort: MatSort = new MatSort()
    displayedColumns: string[] = ['product', 'sale', 'purchase', 'utility']
    dataSource: MatTableDataSource<SummarySaleItemModel> = new MatTableDataSource()
    formGroup: FormGroup = this.formBuilder.group({
        userId: '',
        officeId: '',
        categoryId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })

    offices: OfficeModel[] = []
    users: UserModel[] = []
    summarySaleItems: SummarySaleItemModel[] = []
    categories: CategoryModel[] = []
    private params: Params = {}

    private handleAuth$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleOffices$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort
    }

    ngOnInit() {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.formGroup.patchValue({ officeId: auth.office._id })
            Object.assign(this.params, { officeId: auth.office._id })
            this.fetchData()
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleOffices$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
            this.offices = offices
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'export_excel': {
                    this.navigationService.loadBarStart()
                    this.navigationService.loadBarFinish()
                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    body.push([
                        'CODIGO',
                        'CODIGO I.',
                        'PRODUCTO',
                        'CATEGORIA',
                        'PRECIO PROMEDIO',
                        'COSTO ACTUAL',
                        'CANTIDAD',
                        'TOTAL VENTA',
                        'TOTAL COMPRA',
                        'UTILIDAD',
                    ])
                    for (const summarySaleItem of this.summarySaleItems) {
                        const category = this.categories.find(e => e._id === summarySaleItem.categoryId)
                        body.push([
                            summarySaleItem.sku,
                            summarySaleItem.upc,
                            summarySaleItem.fullName,
                            (category?.name || 'SIN CATEGORIA').toUpperCase(),
                            Number((summarySaleItem.totalSale / summarySaleItem.totalQuantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                            Number((summarySaleItem.cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                            Number(summarySaleItem.totalQuantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                            Number((summarySaleItem.totalSale).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                            Number((summarySaleItem.totalPurchase).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                            Number((summarySaleItem.totalSale - summarySaleItem.totalPurchase)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        ])
                    }
                    const name = `UTILIDADES_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}`
                    buildExcel(body, name, wscols, [])
                }
            }
        })
    }

    fetchData() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.salesService.getSummarySaleItemsByRangeDate(startDate, endDate, this.params).subscribe(summarySaleItems => {
                this.navigationService.loadBarFinish()
                this.summarySaleItems = summarySaleItems
                this.dataSource = new MatTableDataSource(summarySaleItems)
                this.dataSource.sort = this.sort
            })
        }
    }

    onRangeChange() {
        this.fetchData()
    }

    totalSales() {
        return this.summarySaleItems.map(e => e.totalSale || 0).reduce((a, b) => a + b, 0)
    }

    totalPurchases() {
        return this.summarySaleItems.map(e => e.totalPurchase || 0).reduce((a, b) => a + b, 0)
    }

    onUserChange() {
        const { userId } = this.formGroup.value
        Object.assign(this.params, { userId })
        this.fetchData()
    }

    onOfficeChange() {
        const { officeId } = this.formGroup.value
        Object.assign(this.params, { officeId })
        this.fetchData()
    }

    onCategoryChange() {
        const { categoryId } = this.formGroup.value
        Object.assign(this.params, { categoryId })
        this.fetchData()
    }

}
