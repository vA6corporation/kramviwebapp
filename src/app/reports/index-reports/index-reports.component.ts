import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
    selector: 'app-index-reports',
    templateUrl: './index-reports.component.html',
    styleUrls: ['./index-reports.component.sass']
})
export class IndexReportsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    selectedIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Reportes')
        const { tabIndex } = this.activatedRoute.snapshot.queryParams
        this.selectedIndex = tabIndex
    }

    onChangeSelected(tabIndex: number) {
        const queryParams: Params = { tabIndex }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
    }


}
