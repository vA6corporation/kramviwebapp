import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../user.model';
import { UsersService } from '../users.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-disabled-users',
    imports: [MaterialModule, CommonModule],
    templateUrl: './disabled-users.component.html',
    styleUrls: ['./disabled-users.component.sass']
})
export class DisabledUsersComponent {

    constructor(
        private readonly usersService: UsersService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['name', 'email', 'assignedOffice', 'actions']
    dataSource: UserModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Usuarios')

        this.navigationService.loadBarStart()
        this.usersService.getDisabledUsers().subscribe(users => {
            this.navigationService.loadBarFinish()
            this.dataSource = users
        })
    }

    onRestoreUser(userId: string) {
        this.navigationService.loadBarStart()
        this.usersService.restore(userId).subscribe(() => {
            this.dataSource = this.dataSource.filter(e => e._id !== userId)
            this.navigationService.showMessage('Restablecido correctamente')
            this.navigationService.loadBarFinish()
        })
    }

}
