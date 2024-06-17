import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OutStockModel } from '../out-stock.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-out-stock',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './dialog-out-stock.component.html',
    styleUrls: ['./dialog-out-stock.component.sass']
})
export class DialogOutStockComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly outStocks: OutStockModel[],
    ) { }

    ngOnInit(): void {

    }

}
