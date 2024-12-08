import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NavigationService } from '../../navigation/navigation.service';
import { TableModel } from '../table.model';
import { TablesService } from '../tables.service';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tables',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.sass']
})
export class TablesComponent {

    constructor(
        private readonly tablesService: TablesService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['name', 'deletedAt', 'actions']
    dataSource: TableModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Mesas')
        this.fetchData()
    }

    onRestoreTable(table: TableModel) {
        table.deletedAt = null 
        this.navigationService.loadBarStart()
        this.tablesService.update(table, table._id).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage('Se han guardado los cambios')
        })
    }

    onDeleteTable(table: TableModel) {
        const ok = confirm('Estas seguro de desactivar?...')
        if (ok) {
            table.deletedAt = new Date().toDateString()
            this.navigationService.loadBarStart()
            this.tablesService.update(table, table._id).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Se han guardado los cambios')
            })
        }
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.tablesService.getTables().subscribe(tables => {
            this.navigationService.loadBarFinish()
            this.dataSource = tables
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
