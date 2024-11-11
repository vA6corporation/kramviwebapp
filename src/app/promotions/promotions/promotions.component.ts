import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PromotionModel } from '../promotion.model';
import { PromotionsService } from '../promotions.service';

@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.sass']
})
export class PromotionsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly promotionsService: PromotionsService,
    ) { }

    displayedColumns: string[] = ['open', 'close', 'user', 'actions'];
    dataSource: PromotionModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;
    business: BusinessModel = new BusinessModel();
    office: OfficeModel = new OfficeModel();

    ngOnInit(): void {
        this.navigationService.setTitle('Promociones');
    }

    handlePageEvent(event: PageEvent): void {
        // this.doctorsService.getDoctorsByPage(event.pageIndex + 1, event.pageSize).subscribe(doctors => {
        //   this.dataSource = doctors;
        // });
    }

}
