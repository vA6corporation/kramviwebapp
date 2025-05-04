import { Component } from '@angular/core';
import { ToolsService } from '../tools.service';
import { MaterialModule } from '../../material.module';
import { DialogAdminComponent, DialogAdminData } from '../../invoices/dialog-admin/dialog-admin.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-duplicate-invoices',
    imports: [MaterialModule],
    templateUrl: './duplicate-invoices.component.html',
    styleUrl: './duplicate-invoices.component.sass'
})
export class DuplicateInvoicesComponent {

    constructor(
        private readonly toolsService: ToolsService,
        private readonly matDialog: MatDialog,
    ) { }

    duplicates: any[] = []
    missings: any[] = []

    ngOnInit() {
        this.fetchData()
    }

    fetchData() {
        this.toolsService.getDuplicates().subscribe(res => {
            this.duplicates = res.duplicates
            this.missings = res.missings
        })
    }

    onSelectSale(saleId: string) {
        const data: DialogAdminData = {
            saleId,
            saleIds: []
        }

        this.matDialog.open(DialogAdminComponent, {
            width: '600px',
            position: { top: '20px' },
            data,
        })
    }

}
