import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { CategorySuppliesService } from '../../supplies/category-supplies.service';
import { CategorySupplyModel } from '../../supplies/category-supply.model';
import { SuppliesService } from '../../supplies/supplies.service';
import { SupplyModel } from '../../supplies/supply.model';
import { DialogAddStockSupplyComponent } from '../dialog-add-stock-supply/dialog-add-stock-supply.component';
import { DialogMoveStockSupplyComponent } from '../dialog-move-stock-supply/dialog-move-stock-supply.component';
import { DialogRemoveStockSupplyComponent } from '../dialog-remove-stock-supply/dialog-remove-stock-supply.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-inventory-supplies',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './inventory-supplies.component.html',
    styleUrls: ['./inventory-supplies.component.sass']
})
export class InventorySuppliesComponent {

    constructor(
        private readonly suppliesService: SuppliesService,
        private readonly navigationService: NavigationService,
        private readonly categorySuppliesService: CategorySuppliesService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog
    ) { }

    categoryId: string = ''
    displayedColumns: string[] = ['name', 'feature', 'brand', 'cost', 'stock', 'actions']
    dataSource: SupplyModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup = this.formBuilder.group({
        categorySupplyId: '',
    })
    categorySupplies: CategorySupplyModel[] = []
    private params: Params = {}

    private handleCategorySupplies$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCategorySupplies$.unsubscribe()
        this.handleSearch$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Inventario de Insumos')

        this.handleCategorySupplies$ = this.categorySuppliesService.handleCategorySupplies().subscribe(categorySupplies => {
            this.categorySupplies = categorySupplies
        })

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            // { id: 'printer', icon: 'printer', show: false, label: 'Reimprimir' }
        ])

        const { categorySupplyId, pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.formGroup.patchValue({
            categorySupplyId: categorySupplyId || '',
        })
        Object.assign(this.params, {
            categorySupplyId: categorySupplyId || '',
        })
        this.fetchCount()
        this.fetchData()

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.suppliesService.getSuppliesByKeyWithStock(key).subscribe(products => {
                this.navigationService.loadBarFinish()
                this.dataSource = products
            }, (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        })
    }

    fetchData(): void {
        this.navigationService.loadBarStart()
        this.suppliesService.getSuppliesByPageWithStock(this.pageIndex + 1, this.pageSize, this.params).subscribe(supplies => {
            this.navigationService.loadBarFinish()
            this.dataSource = supplies
        })
    }

    fetchCount() {
        this.suppliesService.getCountSupplies(this.params).subscribe(count => {
            this.length = count
        })
    }

    onAddStock(supply: SupplyModel) {
        const dialogRef = this.matDialog.open(DialogAddStockSupplyComponent, {
            width: '600px',
            position: { top: '20px' },
            data: supply._id,
        })

        dialogRef.afterClosed().subscribe(stock => {
            if (stock) {
                supply.stock += stock
            }
        })
    }

    onRemoveStock(supply: SupplyModel) {
        const dialogRef = this.matDialog.open(DialogRemoveStockSupplyComponent, {
            width: '600px',
            position: { top: '20px' },
            data: supply._id,
        })

        dialogRef.afterClosed().subscribe(stock => {
            if (stock) {
                supply.stock -= stock
            }
        })
    }

    onMoveStock(product: SupplyModel) {
        const dialogRef = this.matDialog.open(DialogMoveStockSupplyComponent, {
            width: '600px',
            position: { top: '20px' },
            data: product,
        })

        dialogRef.afterClosed().subscribe(stock => {
            if (stock) {
                product.stock -= stock
            }
        })
    }

    onCategoryChange() {

        const { categorySupplyId } = this.formGroup.value

        this.pageIndex = 0

        const queryParams: Params = { categorySupplyId, pageIndex: this.pageIndex, key: null }

        Object.assign(this.params, { categorySupplyId })

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
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
    }

}
