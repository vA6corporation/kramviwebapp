import { Component } from '@angular/core'
import { NavigationService } from '../../navigation/navigation.service'
import { MaterialModule } from '../../material.module'
import { ImportProductsComponent } from '../import-products/import-products.component'
import { ImportCustomersComponent } from '../import-customers/import-customers.component'
import { ImportStockComponent } from '../import-stock/import-stock.component'
import { DeleteDataComponent } from '../delete-data/delete-data.component'
import { DuplicateInvoicesComponent } from '../duplicate-invoices/duplicate-invoices.component'

@Component({
    selector: 'app-tools',
    imports: [
        MaterialModule,
        ImportProductsComponent,
        ImportCustomersComponent,
        ImportStockComponent,
        DeleteDataComponent,
        DuplicateInvoicesComponent,
    ],
    templateUrl: './tools.component.html',
    styleUrls: ['./tools.component.sass']
})
export class ToolsComponent {

    constructor(
        private readonly navigationService: NavigationService,
    ) { }

    ngOnInit(): void {
        this.navigationService.setTitle('Herramientas')
    }

}
