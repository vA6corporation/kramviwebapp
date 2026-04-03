import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { OfficesComponent } from '../offices/offices.component';
import { DisabledOfficesComponent } from '../disabled-offices/disabled-offices.component';

@Component({
    selector: 'app-index-offices',
    imports: [MaterialModule, OfficesComponent, DisabledOfficesComponent],
    templateUrl: './index-offices.component.html',
    styleUrls: ['./index-offices.component.sass'],
})
export class IndexOfficesComponent {

  constructor() { }

}
