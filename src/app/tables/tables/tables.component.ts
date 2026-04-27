import { Component, inject, signal } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { NavigationService } from '../../navigation/navigation.service'
import { TableModel } from '../table.model'
import { TablesService } from '../tables.service'
import { MaterialModule } from '../../material.module'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-tables',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.sass']
})
export class TablesComponent {

    private readonly tablesService = inject(TablesService)
    private readonly navigationService = inject(NavigationService)

    displayedColumns: string[] = ['name', 'deletedAt', 'actions']
    $dataSource = signal<TableModel[]>([])
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Mesas')
        this.fetchData()
    }

    onRestoreTable(table: TableModel) {
        this.navigationService.loadBarStart()
        this.tablesService.restore(table.id).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage('Se han guardado los cambios')
            this.fetchData()
        })
    }

    onDeleteTable(table: TableModel) {
        const ok = confirm('Estas seguro de desactivar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.tablesService.delete(table.id).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Se han guardado los cambios')
                this.fetchData()
            })
        }
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.tablesService.getTables().subscribe(tables => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(tables)
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
