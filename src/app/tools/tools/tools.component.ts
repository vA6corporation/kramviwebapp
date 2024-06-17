import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
    selector: 'app-tools',
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
