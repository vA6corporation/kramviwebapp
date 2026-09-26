import { Component, inject, signal } from '@angular/core'
import { Subscription } from 'rxjs'
import { NavigationService } from '../../navigation/navigation.service'
import { UserModel } from '../user.model'
import { UsersService } from '../users.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-deleted-users',
    imports: [MaterialModule, CommonModule],
    templateUrl: './deleted-users.component.html',
    styleUrl: './deleted-users.component.sass',
})
export class DeletedUsersComponent {

    private readonly usersService = inject(UsersService)
    private readonly navigationService = inject(NavigationService)

    displayedColumns: string[] = ['name', 'email', 'office', 'actions']
    $dataSource = signal<UserModel[]>([])
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Usuarios desactivados')

        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.usersService.getDeletedUsers().subscribe(users => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(users)
        })
    }

    onRestoreUser(userId: any) {
        this.navigationService.loadBarStart()
        this.usersService.restore(userId).subscribe(() => {
            this.navigationService.showMessage('Restablecido correctamente')
            this.navigationService.loadBarFinish()
            this.fetchData()
        })
    }

}
