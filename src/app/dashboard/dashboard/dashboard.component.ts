import { Component } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { CollectionsComponent } from '../collections/collections.component';
import { ExpensesComponent } from '../expenses/expenses.component';
import { InvoicesComponent } from '../invoices/invoices.component';

@Component({
    selector: 'app-dashboard',
    imports: [MaterialModule, CollectionsComponent, ExpensesComponent, InvoicesComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent {

    constructor(
        private readonly navigationService: NavigationService,
    ) { }

    ngOnInit(): void {
        this.navigationService.setTitle('Dashboard')
    }

}
