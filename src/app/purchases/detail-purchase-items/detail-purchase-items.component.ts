import { Component, inject } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { NavigationService } from '../../navigation/navigation.service'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../../users/users.service'
import { HttpErrorResponse } from '@angular/common/http'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router'
import { PurchasesService } from '../../purchases/purchases.service'
import { PurchaseItemModel } from '../../purchases/purchase-item.model'
import { DialogDetailPurchasesComponent } from '../dialog-detail-purchases/dialog-detail-purchases.component'
import { ProductsService } from '../../products/products.service'
import { ProductModel } from '../../products/product.model'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
    selector: 'app-detail-purchase-items',
    imports: [MaterialModule, RouterModule, ReactiveFormsModule, CommonModule],
    templateUrl: './detail-purchase-items.component.html',
    styleUrl: './detail-purchase-items.component.sass'
})
export class DetailPurchaseItemsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly usersService = inject(UsersService)
    private readonly productsService = inject(ProductsService)
    private readonly purchasesService = inject(PurchasesService)
    private readonly navigationService = inject(NavigationService)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)

    displayedColumns: string[] = ['createdAt', 'user', 'quantity', 'cost', 'charge', 'actions']
    dataSource: PurchaseItemModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    users: UserModel[] = []
    product: ProductModel | null = null
    private productId: any = ''
    private params: Params = {}

    private handleAuth$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()

    formGroup: FormGroup = this.formBuilder.group({
        userId: '',
    })

    ngOnDestroy(): void {
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Detalle de compras')
        this.productId = this.activatedRoute.snapshot.params['productId']
        Object.assign(this.params, { productId: this.productId })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.productsService.getProductById(this.productId).subscribe(product => {
            this.product = product
        })

        this.fetchData()
        this.fetchCount()
    }

    onDetailPurchase(purchaseId: any) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }

    fetchCount() {
        this.purchasesService.getCountPurchaseItemsByProduct(this.productId, this.params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseItemsByPageProduct(this.pageIndex + 1, this.pageSize, this.productId, this.params).subscribe(purchaseItems => {
            this.navigationService.loadBarFinish()
            this.dataSource = purchaseItems
        })
    }

    onUserChange() {
        this.pageIndex = 0
        const { userId } = this.formGroup.value
        const queryParams: Params = { userId }

        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
