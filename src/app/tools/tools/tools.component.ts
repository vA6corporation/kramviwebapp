import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { ImportProductsComponent } from '../import-products/import-products.component';
import { ImportCustomersComponent } from '../import-customers/import-customers.component';
import { UpdatePricesComponent } from '../update-prices/update-prices.component';
import { AddStockComponent } from '../add-stock/add-stock.component';
import { DeleteDataComponent } from '../delete-data/delete-data.component';
import { CheckStockComponent } from '../check-stock/check-stock.component';

@Component({
    selector: 'app-tools',
    standalone: true,
    imports: [
        MaterialModule, 
        ImportProductsComponent, 
        ImportCustomersComponent, 
        UpdatePricesComponent, 
        AddStockComponent,
        DeleteDataComponent,
        CheckStockComponent,
    ],
    templateUrl: './tools.component.html',
    styleUrls: ['./tools.component.sass']
})
export class ToolsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
    ) { }

    ngOnInit(): void {
        this.navigationService.setTitle('Herramientas');
    }

}
