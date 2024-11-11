import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { CategorySuppliesService } from '../category-supplies.service';
import { CategorySupplyModel } from '../category-supply.model';
import { DialogDetailSuppliesComponent } from '../dialog-detail-supplies/dialog-detail-supplies.component';
import { SuppliesService } from '../supplies.service';
import { SupplyModel } from '../supply.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { CategorySuppliesComponent } from '../category-supplies/category-supplies.component';

@Component({
    selector: 'app-supplies',
    standalone: true,
    imports: [MaterialModule, RouterModule, ReactiveFormsModule, CategorySuppliesComponent, CommonModule],
    templateUrl: './supplies.component.html',
    styleUrls: ['./supplies.component.sass']
})
export class SuppliesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly suppliesService: SuppliesService,
        private readonly categorySuppliesService: CategorySuppliesService,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router
    ) { }

    displayedColumns: string[] = ['fullName', 'feature', 'brand', 'cost', 'stock', 'actions']
    dataSource: SupplyModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup = this.formBuilder.group({
        categorySupplyId: ''
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
        this.navigationService.setTitle('Insumos')

        this.handleCategorySupplies$ = this.categorySuppliesService.handleCategorySupplies().subscribe(categorySupplies => {
            this.categorySupplies = categorySupplies
        })

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'export_products', icon: 'printer', show: false, label: 'Exportar productos' }
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.suppliesService.getSuppliesByKeyWithStock(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = products
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

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

    onDetails(supplyId: string) {
        this.matDialog.open(DialogDetailSuppliesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: supplyId,
        })
    }

    deleteSupply(supplyId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.suppliesService.delete(supplyId).subscribe(() => {
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
            })
        }
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
}
