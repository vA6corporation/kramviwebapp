import { Component } from '@angular/core'
import { MaterialModule } from '../../material.module'
import { UsersComponent } from '../users/users.component'
import { DeletedUsersComponent } from '../deleted-users/deleted-users.component'

@Component({
    selector: 'app-index-users',
    imports: [MaterialModule, UsersComponent, DeletedUsersComponent],
    templateUrl: './index-users.component.html',
    styleUrls: ['./index-users.component.sass']
})
export class IndexUsersComponent {

  constructor() { }

}
