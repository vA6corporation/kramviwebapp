import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../user.model';
import { UsersService } from '../users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-users',
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.sass']
})
export class UsersComponent {

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
    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Usuarios')
        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.usersService.getUsersByKey(key).subscribe(users => {
                this.navigationService.loadBarFinish()
                this.dataSource = users
            }, (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'excel_simple':
                    this.navigationService.loadBarFinish()
                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    body.push([
                        'NOMBRE',
                        'EMAIL',
                        'SUCURSAL'
                    ])
                    for (const user of this.dataSource) {
                        body.push([
                            user.name,
                            user.email,
                            user.assignedOffice ? user.assignedOffice.name.toUpperCase() : 'TODAS'
                        ])
                    }
                    const name = `USUARIOS`
                    buildExcel(body, name, wscols, [], [])
                    break

                default:
                    break
            }
        })

        this.fetchData()
        this.fetchCount()
    }

    fetchCount() {
        this.usersService.getCountUsers().subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.usersService.getUsersByPage(this.pageIndex + 1, this.pageSize).subscribe(users => {
            this.navigationService.loadBarFinish()
            this.dataSource = users
        })
    }

    onDeleteUser(userId: string) {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.usersService.delete(userId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.dataSource = this.dataSource.filter(e => e._id !== userId)
            })
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }
}
