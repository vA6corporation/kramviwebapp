import { Component } from '@angular/core'
import { MaterialModule } from '../../material.module'
import { OfficesComponent } from '../offices/offices.component'
import { DeletedOfficesComponent } from '../deleted-offices/deleted-offices.component'

@Component({
    selector: 'app-index-offices',
    imports: [MaterialModule, OfficesComponent, DeletedOfficesComponent],
    templateUrl: './index-offices.component.html',
    styleUrls: ['./index-offices.component.sass'],
})
export class IndexOfficesComponent {

  constructor() { }

}
