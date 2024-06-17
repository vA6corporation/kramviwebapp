import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { buildExcel } from '../../buildExcel';
import { MaterialModule } from '../../material.module';
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { ProductsService } from '../../products/products.service';
import { LotModel } from '../lot.model';
import { LotsService } from '../lots.service';
import { DialogDetailPurchasesComponent } from '../../purchases/dialog-detail-purchases/dialog-detail-purchases.component';

@Component({
  selector: 'app-lots',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './lots.component.html',
  styleUrl: './lots.component.sass'
})
export class LotsComponent {

    constructor(
        private readonly lotsService: LotsService,
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly categoriesService: CategoriesService,
        private readonly matDialog: MatDialog,
    ) { }

    displayedColumns: string[] = ['product', 'quantity', 'lotNumber', 'expirationAt', 'user', 'actions']
    dataSource: LotModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    categories: CategoryModel[] = []
    productId = ''

    private handleCategories$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleCategories$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Lotes')
        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.productId = this.activatedRoute.snapshot.queryParams['productId'] || ''
        if (this.productId) {
            this.productsService.getProductById(this.productId).subscribe(product => {
                
            })
        }

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            // this.usersService.getUsersByKey(key).subscribe(users => {
            //     this.navigationService.loadBarFinish()
            //     this.dataSource = users
            // }, (error: HttpErrorResponse) => {
            //     this.navigationService.loadBarFinish()
            //     this.navigationService.showMessage(error.error.message)
            // })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            switch (id) {
                case 'excel_simple':
                    const chunk = 500
                    const lots: LotModel[] = []

                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.length / chunk
                    })

                    for (let index = 0; index < this.length / chunk; index++) {
                        const values = await lastValueFrom(this.lotsService.getLotsByPage(index + 1, chunk, {}))
                        dialogRef.componentInstance.onComplete()
                        lots.push(...values)
                    }

                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []

                    body.push([
                        'LOTE',
                        'F. VENCIMIENTO',
                        'PRODUCTO',
                        'VARIANTE',
                        'MARCA',
                        'CATEGORIA',
                        'C. INTERNO',
                        'C. FABRICANTE',
                        'STOCK',
                    ])

                    for (const lot of lots) {
                        body.push([
                            lot.lotNumber,
                            formatDate(new Date(lot.expirationAt), 'dd/MM/yyyy', 'en-US'),
                            lot.product.name.toUpperCase(),
                            (lot.product.feature || '').toUpperCase(),
                            (lot.product.brand || '').toUpperCase(),
                            (this.categories.find(e => e._id === lot.product.categoryId)?.name || '').toUpperCase(),
                            lot.product.sku,
                            lot.product.upc,
                            lot.product.stock,
                        ])
                    }

                    const name = `LOTES_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}`
                    buildExcel(body, name, wscols, [], [])
                    break

                default:
                    break
            }
        })

        this.fetchData()
        this.fetchCount()
    }

    onDetailPurchase(purchaseId: string) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }

    fetchCount() {
        const params = { productId: this.productId }
        this.lotsService.getCountLots(params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        const params = { productId: this.productId }
        this.lotsService.getLotsByPage(this.pageIndex + 1, this.pageSize, params).subscribe(users => {
            this.navigationService.loadBarFinish()
            this.dataSource = users
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }
    
}
