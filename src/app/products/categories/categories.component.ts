import { Component, inject, signal } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { DialogEditCategoriesComponent } from '../dialog-edit-categories/dialog-edit-categories.component'
import { DialogCreateCategoriesComponent } from '../dialog-create-categories/dialog-create-categories.component'
import { DialogProductsComponent } from '../dialog-products/dialog-products.component'
import { Subscription } from 'rxjs'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../categories.service'
import { CategoryModel } from '../category.model'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-categories',
    imports: [MaterialModule, CommonModule],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly matDialog = inject(MatDialog)

    displayedColumns: string[] = ['id', 'name', 'products', 'actions']
    $dataSource = signal<CategoryModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    categoriesId: any[] = []

    ngOnInit(): void {
        this.navigationService.setTitle('Categorias')
        this.fetchData()
        this.fetchCount()
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

    fetchData() {
        this.navigationService.loadBarStart()
        this.categoriesService.getCategoriesByPage(this.pageIndex + 1, this.pageSize).subscribe(categories => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(categories)
        })
    }

    fetchCount() {
        this.categoriesService.getCountCategories().subscribe(count => {
            this.$length.set(count)
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

    onDelete(categoryId: any) {
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

    onRestore(categoryId: any) {
        const ok = confirm('Esta seguro de restaurar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.categoriesService.restore(categoryId).subscribe({
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
