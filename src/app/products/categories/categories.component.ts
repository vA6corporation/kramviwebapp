import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditCategoriesComponent } from '../dialog-edit-categories/dialog-edit-categories.component';
import { DialogCreateCategoriesComponent } from '../dialog-create-categories/dialog-create-categories.component';
import { DialogProductsComponent } from '../dialog-products/dialog-products.component';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../categories.service';
import { CategoryModel } from '../category.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-categories',
    imports: [MaterialModule, CommonModule],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly matDialog: MatDialog,
    ) { }

    displayedColumns: string[] = ['checked', 'name', 'products', 'actions']
    dataSource: CategoryModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    categoriesId: string[] = []

    private handleClickMenu$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Categorias')
        this.fetchData()
        this.fetchCount()

        this.navigationService.setMenu([
            { id: 'join_categories', label: 'Combinar categorias', icon: 'join_left', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            this.onJoinCategories()
        })
    }

    onShowProducts(category: CategoryModel) {
        this.matDialog.open(DialogProductsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: category,
        })
    }

    handlePageEvent(event: PageEvent): void {
        const { pageIndex, pageSize } = event
        this.pageIndex = pageIndex
        this.pageSize = pageSize
        this.fetchData()
    }

    checkAllCategories(isChecked: boolean) {
        if (isChecked) {
            this.categoriesId = []
            this.categoriesId = this.dataSource.map(e => e._id)
        } else {
            this.categoriesId = []
        }
    }

    checkCategoryId(isChecked: boolean, categoryId: string) {
        if (isChecked) {
            this.categoriesId.push(categoryId)
        } else {
            const index = this.categoriesId.indexOf(categoryId)
            if (index > -1) {
                this.categoriesId.splice(index, 1)
            }
        }
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.categoriesService.getCategoriesByPage(this.pageIndex + 1, this.pageSize).subscribe(categories => {
            this.navigationService.loadBarFinish()
            this.dataSource = categories
        })
    }

    fetchCount() {
        this.categoriesService.getCountCategories().subscribe(count => {
            this.length = count
        })
    }

    onCreateCategory() {
        const dialogRef = this.matDialog.open(DialogCreateCategoriesComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(category => {
            if (category) {
                this.navigationService.loadBarStart()
                this.categoriesService.create(category).subscribe({
                    next: () => {
                        this.fetchData()
                        this.navigationService.showMessage('Registrado correctamente')
                        this.navigationService.loadBarFinish()
                        this.categoriesService.loadCategories()
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
            }
        })
    }

    onEdit(category: CategoryModel) {
        const dialogRef = this.matDialog.open(DialogEditCategoriesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: category,
        })

        dialogRef.afterClosed().subscribe(ok => {
            if (ok) {
                this.fetchData()
                this.categoriesService.loadCategories()
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
                    this.categoriesService.loadCategories()
                    this.fetchData()
                    this.fetchCount()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onJoinCategories() {
        this.navigationService.loadBarStart()
        this.categoriesService.joinCategories(this.categoriesId).subscribe({
            next: () => {
                this.navigationService.loadBarFinish()
                this.categoriesId = []
                this.fetchData()
                this.fetchCount()
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onRestore(category: CategoryModel) {
        const ok = confirm('Esta seguro de restaurar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            category.deletedAt = null
            this.categoriesService.update(category, category._id).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.categoriesService.loadCategories()
                    this.fetchData()
                    this.navigationService.showMessage('Categoria restaurada')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
