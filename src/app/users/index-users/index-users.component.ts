import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { UsersComponent } from '../users/users.component';
import { DisabledUsersComponent } from '../disabled-users/disabled-users.component';

@Component({
    selector: 'app-index-users',
    imports: [MaterialModule, UsersComponent, DisabledUsersComponent],
    templateUrl: './index-users.component.html',
    styleUrls: ['./index-users.component.sass']
})
export class IndexUsersComponent {

  constructor() { }

}
