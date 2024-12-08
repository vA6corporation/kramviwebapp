import { Component } from '@angular/core';
import { ToolsService } from '../tools.service';
import { MaterialModule } from '../../material.module';
import { ProductModel } from '../../products/product.model';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
    selector: 'app-check-stock',
    imports: [MaterialModule],
    templateUrl: './check-stock.component.html',
    styleUrl: './check-stock.component.sass'
})
export class CheckStockComponent {

    constructor(
        private readonly toolsService: ToolsService,
        private readonly navigationService: NavigationService,
    ) { }

    trackedProducts: ProductModel[] = []

    ngOnInit() {
        this.navigationService.loadBarStart()
        this.toolsService.checkStock().subscribe(trackedProducts => {
            this.navigationService.loadBarFinish()
            this.trackedProducts = trackedProducts
        })
    }

}
