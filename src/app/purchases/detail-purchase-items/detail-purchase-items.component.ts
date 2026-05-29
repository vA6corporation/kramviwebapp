import { Component, inject, signal } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { NavigationService } from '../../navigation/navigation.service'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../../users/users.service'
import { HttpErrorResponse } from '@angular/common/http'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Params } from '@angular/router'
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
    private readonly usersService = inject(UsersService)
    private readonly productsService = inject(ProductsService)
    private readonly purchasesService = inject(PurchasesService)
    private readonly navigationService = inject(NavigationService)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)

    displayedColumns: string[] = ['createdAt', 'user', 'quantity', 'cost', 'charge', 'actions']
    $dataSource = signal<PurchaseItemModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $users = signal<UserModel[]>([])
    private productId: any = ''
    private params: Params = {}

    private handleAuth$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()

    formGroup: FormGroup = this.formBuilder.group({
        userId: '',
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })

    ngOnDestroy(): void {
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.productId = this.activatedRoute.snapshot.params['productId']
        Object.assign(this.params, { productId: this.productId })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.$users.set(users)
        })

        this.productsService.getProductById(this.productId).subscribe(product => {
            this.navigationService.setTitle(`Detalle de compras - ${product.fullName}`)
        })

        this.fetchData()
        this.fetchCount()
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0

            const { startDate, endDate } = this.formGroup.value
            Object.assign(this.params, { startDate, endDate })

            this.fetchCount()
            this.fetchData()
        }
    }

    onDetailPurchase(purchaseId: any) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }

    fetchCount() {
        this.purchasesService.getCountPurchaseItems(this.params).subscribe(count => {
            this.$length.set(count)
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseItemsByPageProduct(this.pageIndex + 1, this.pageSize, this.productId, this.params).subscribe(purchaseItems => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(purchaseItems)
        })
    }

    onUserChange() {
        this.pageIndex = 0

        const { userId } = this.formGroup.value
        Object.assign(this.params, { userId })

        this.fetchCount()
        this.fetchData()
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
