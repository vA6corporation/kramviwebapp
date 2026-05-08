import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Params } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { buildExcel } from '../../buildExcel'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../../offices/offices.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { SalesService } from '../../sales/sales.service'
import { SummarySaleItemModel } from '../../sales/summary-sale-item.model'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../../users/users.service'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'

@Component({
    selector: 'app-products',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.sass']
})
export class ProductsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly salesService = inject(SalesService)
    private readonly usersService = inject(UsersService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly navigationService = inject(NavigationService)
    private readonly officesService = inject(OfficesService)
    private readonly authService = inject(AuthService)

    @ViewChild(MatSort) sort: MatSort = new MatSort()

    formGroup: FormGroup = this.formBuilder.group({
        categoryId: '',
        userId: '',
        officeId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    displayedColumns: string[] = ['product', 'quantity', 'price', 'cost', 'totalCharge', 'totalPurchase', 'totalUtility', 'stock']
    $dataSource = signal<MatTableDataSource<SummarySaleItemModel>>(new MatTableDataSource())
    categoryId: string = ''
    $categories = signal<CategoryModel[]>([])
    $summarySaleItems = signal<SummarySaleItemModel[]>([])
    $users = signal<UserModel[]>([])
    $totalQuantity = signal<number>(0)
    $totalCharge = signal<number>(0)

    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngAfterViewInit() {
        this.$dataSource().sort = this.sort
    }

    ngOnInit() {
        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.$categories.set(categories)
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.$users.set(users)
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const { startDate, endDate } = this.formGroup.value

            let wscols = [50, 50, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'PRODUCTO',
                'CODIGO INTERNO',
                'CODIGO FABRICANTE',
                'CATEGORIA',
                'UNIDADES',
                'PRECIO UNITARIO',
                'COSTO UNITARIO',
                'VENTA TOTAL',
                'COSTO TOTAL',
                'UTILIDAD',
                'STOCK',
            ])

            this.$summarySaleItems().forEach(summarySaleItem => {
                body.push([
                    summarySaleItem.fullName.toUpperCase(),
                    summarySaleItem.sku,
                    summarySaleItem.upc,
                    this.$categories().find(e => e.id === summarySaleItem.categoryId)?.name.toUpperCase(),
                    summarySaleItem.totalQuantity,
                    Number((summarySaleItem.totalCharge / summarySaleItem.totalQuantity).toFixed(2)),
                    summarySaleItem.cost,
                    summarySaleItem.totalCharge,
                    summarySaleItem.totalQuantity * (summarySaleItem.cost || 0),
                    summarySaleItem.totalCharge - summarySaleItem.totalPurchase,
                    summarySaleItem.stock,
                ])
            })

            const name = `PRODUCTOS_VENDIDOS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}`
            buildExcel(body, name, wscols, [])
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.formGroup.patchValue({ officeId: auth.office.id })
            this.fetchData()
        })
    }

    formatInteger(charge: number): string {
        if (Number.isInteger(charge)) {
            return charge.toString()
        } else {
            return charge.toFixed(2)
        }
    }

    totalCharge() {
        return this.$summarySaleItems().map(e => e.totalCharge || 0).reduce((a, b) => a + b, 0)
    }

    totalPurchases() {
        return this.$summarySaleItems().map(e => e.totalPurchase || 0).reduce((a, b) => a + b, 0)
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()

            const { startDate, endDate, officeId, categoryId, userId } = this.formGroup.value

            const params: Params = {
                categoryId, userId, officeId
            }

            this.salesService.getSummarySaleItemsByRangeDate(
                startDate,
                endDate,
                params
            ).subscribe(summarySaleItems => {
                this.navigationService.loadBarFinish()
                this.$summarySaleItems.set(summarySaleItems)
                this.$dataSource.set(new MatTableDataSource(summarySaleItems))
                this.$dataSource().sort = this.sort

                this.$totalCharge.set(summarySaleItems.map(e => e.totalCharge).reduce((a, b) => a + b, 0))
                this.$totalQuantity.set(summarySaleItems.map(e => e.totalQuantity).reduce((a, b) => a + b, 0))
            })
        }
    }

    onOfficeChange() {
        this.fetchData()
    }

    onCategoryChange() {
        this.fetchData()
    }

    onUserChange() {
        this.fetchData()
    }

    onRangeChange() {
        this.fetchData()
    }

}
