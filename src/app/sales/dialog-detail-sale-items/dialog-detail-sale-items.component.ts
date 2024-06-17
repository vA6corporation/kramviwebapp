import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalesService } from '../sales.service';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OfficeModel } from '../../auth/office.model';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { IgvType } from '../../products/igv-type.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-detail-sale-items',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dialog-detail-sale-items.component.html',
  styleUrl: './dialog-detail-sale-items.component.sass'
})
export class DialogDetailSaleItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly saleItemIds: string[],
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
    ) { }

    igvType = IgvType
    saleItems: any[] = []
    office: OfficeModel = new OfficeModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        });
        
        this.salesService.getSaleItemDetails(this.saleItemIds).subscribe(saleItems => {
            console.log(saleItems);
            
            this.saleItems = saleItems
        }) 
    }

}
