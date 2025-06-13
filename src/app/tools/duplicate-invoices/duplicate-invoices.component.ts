import { Component } from '@angular/core';
import { ToolsService } from '../tools.service';
import { MaterialModule } from '../../material.module';
import { DialogAdminComponent, DialogAdminData } from '../../invoices/dialog-admin/dialog-admin.component';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-duplicate-invoices',
    imports: [MaterialModule, CommonModule],
    templateUrl: './duplicate-invoices.component.html',
    styleUrl: './duplicate-invoices.component.sass'
})
export class DuplicateInvoicesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly toolsService: ToolsService,
        private readonly matDialog: MatDialog,
    ) { }

    duplicatesFacturas: any[] = []
    duplicatesBoletas: any[] = []
    duplicatesNotas: any[] = []
    missingsFacturas: any[] = []
    missingsBoletas: any[] = []
    missingsNotas: any[] = []

    ngOnInit() {
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.toolsService.getDuplicates().subscribe(res => {
            this.navigationService.loadBarFinish()
            const { duplicates, missings } = res
            this.duplicatesFacturas = duplicates.facturas.sort((a: any, b: any) => {
                if (a.invoiceNumber > b._id) {
                    return 1
                }
                if (a._id < b._id) {
                    return -1
                }
                return 0
            })
            this.missingsFacturas = missings.facturas

            this.duplicatesBoletas = duplicates.boletas.sort((a: any, b: any) => {
                if (a.invoiceNumber > b._id) {
                    return 1
                }
                if (a._id < b._id) {
                    return -1
                }
                return 0
            })
            this.missingsBoletas = missings.boletas

            this.duplicatesNotas = duplicates.notas.sort((a: any, b: any) => {
                if (a._id > b._id) {
                    return 1
                }
                if (a._id < b._id) {
                    return -1
                }
                return 0
            })

            this.missingsNotas = missings.notas
        })
    }

    onSelectSale(saleId: string) {
        const data: DialogAdminData = {
            saleId,
            saleIds: []
        }

        const dialogRef = this.matDialog.open(DialogAdminComponent, {
            width: '600px',
            position: { top: '20px' },
            data,
        })

        dialogRef.componentInstance.handleUpdate().subscribe(() => {
            this.fetchData()
        })
    }

}
