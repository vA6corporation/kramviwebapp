import { Component } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-index-biller',
    imports: [MaterialModule, RouterModule],
    templateUrl: './index-biller.component.html',
    styleUrls: ['./index-biller.component.sass']
})
export class IndexBillerComponent {

    constructor(
        private readonly navigationSerivce: NavigationService,
    ) { }

    ngOnInit(): void {
        this.navigationSerivce.setTitle('Facturador')
    }

}
