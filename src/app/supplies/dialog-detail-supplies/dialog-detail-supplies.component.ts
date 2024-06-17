import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuppliesService } from '../supplies.service';
import { SupplyModel } from '../supply.model';

@Component({
    selector: 'app-dialog-detail-supplies',
    templateUrl: './dialog-detail-supplies.component.html',
    styleUrls: ['./dialog-detail-supplies.component.sass']
})
export class DialogDetailSuppliesComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly supplyId: string,
        private readonly suppliesService: SuppliesService,
    ) { }

    supply: SupplyModel | null = null
    recipes: any[] = []

    ngOnInit(): void {
        this.suppliesService.getSupplyById(this.supplyId).subscribe(supply => {
            this.supply = supply
            this.recipes = supply.recipes || []
        })
    }

}
