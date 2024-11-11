import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { SuppliesService } from '../../supplies/supplies.service';
import { SupplyModel } from '../../supplies/supply.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-supplies',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './supplies.component.html',
    styleUrls: ['./supplies.component.sass']
})
export class SuppliesComponent {

    constructor(
        private readonly suppliesService: SuppliesService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = [
        'supply',
        'startStock',
        'purchases',
        'eats',
        'finishStock',
        'dailyRegister',
        'diff',
        'cost',
        'valoration'
    ];
    dataSource: SupplyModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    date: Date = new Date()

    ngOnInit(): void {
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.suppliesService.getSuppliesWithStockByDate(this.date).subscribe({
            next: supplies => {
                this.navigationService.loadBarFinish()
                this.dataSource = supplies
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }
}
