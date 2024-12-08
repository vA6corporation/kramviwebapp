import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogEditCategorySuppliesComponent } from '../dialog-edit-category-supplies/dialog-edit-category-supplies.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-category-supplies',
    imports: [MaterialModule, CommonModule],
    templateUrl: './category-supplies.component.html',
    styleUrls: ['./category-supplies.component.sass']
})
export class CategorySuppliesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly matDialog: MatDialog,
    ) { }

    displayedColumns: string[] = ['name', 'products', 'actions']
    dataSource: CategoryModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Categorias')
        this.fetchData()
        this.fetchCount()
    }

    handlePageEvent(event: PageEvent): void {
        const { pageIndex, pageSize } = event
        this.pageIndex = pageIndex
        this.pageSize = pageSize
        this.fetchData()
    }

    fetchData() {
        this.categoriesService.getCategoriesByPage(this.pageIndex + 1, this.pageSize).subscribe(categories => {
            this.dataSource = categories
        })
    }

    fetchCount() {
        this.categoriesService.getCountCategories().subscribe(count => {
            this.length = count
        })
    }

    onEdit(category: CategoryModel) {
        const dialogRef = this.matDialog.open(DialogEditCategorySuppliesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: category,
        })

        dialogRef.afterClosed().subscribe(ok => {
            if (ok) {
                this.fetchData()
            }
        })
    }

    onDelete(categoryId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.categoriesService.delete(categoryId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.fetchData()
                    this.navigationService.showMessage('Eliminado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
