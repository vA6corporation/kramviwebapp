import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogAddPrintersComponent } from '../dialog-add-printers/dialog-add-printers.component';
import { PrinterModel } from '../printer.model';
import { PrintersService } from '../printers.service';

@Component({
    selector: 'app-printers',
    templateUrl: './printers.component.html',
    styleUrls: ['./printers.component.sass']
})
export class PrintersComponent implements OnInit {

    constructor(
        private readonly matDialog: MatDialog,
        private readonly navigationService: NavigationService,
        private readonly printersService: PrintersService,
    ) { }

    dataSource: PrinterModel[] = []
    displayedColumns: string[] = ['name', 'invoice', 'preaccount', 'cocina', 'barra', 'horno', 'caja', 'actions']
    private handlePrinters$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePrinters$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Impresoras')
        this.handlePrinters$ = this.printersService.handlePrinters().subscribe(printers => {
            this.dataSource = printers
        })
        this.printersService.loadDb()
    }

    onAddPrinter() {
        const dialogRef = this.matDialog.open(DialogAddPrintersComponent, {
            width: '600px',
            position: { top: '20px' }
        })

        dialogRef.afterClosed().subscribe(() => {

        })
    }

    onDeletePrinter(_id: string) {
        this.printersService.deletePrinter(_id)
    }

}
