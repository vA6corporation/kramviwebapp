import { Component } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { CollectionsComponent } from '../collections/collections.component';
import { ExpensesComponent } from '../expenses/expenses.component';
import { InvoicesComponent } from '../invoices/invoices.component';

@Component({
    selector: 'app-index-dashboard',
    standalone: true,
    imports: [MaterialModule, CollectionsComponent, ExpensesComponent, InvoicesComponent],
    templateUrl: './index-dashboard.component.html',
    styleUrl: './index-dashboard.component.sass'
})
export class IndexDashboardComponent {

    constructor(
        private readonly navigationService: NavigationService,
    ) { }

    ngOnInit(): void {
        this.navigationService.setTitle('Dashboard')
    }

}
