import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { UserModel } from '../../users/user.model'
import { BanksService } from '../banks.service'
import { BankModel } from '../bank.model'

@Component({
    selector: 'app-banks',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './banks.component.html',
    styleUrls: ['./banks.component.sass']
})
export class BanksComponent {

    private readonly banksService = inject(BanksService)
    private readonly navigationService = inject(NavigationService)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)

    users: UserModel[] = []
    displayedColumns: string[] = ['name', 'currencyName', 'accountNumber', 'cci', 'actions']
    $dataSource = signal<BankModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Cuentas bancarias')
        this.fetchData()
        this.fetchCount()
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart()
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
    }

    onDelete(bankId: any) {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.banksService.delete(bankId).subscribe(() => {
                this.fetchData()
                this.banksService.loadBanks()
            })
        }
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.banksService.getBanks().subscribe(banks => {
            this.$dataSource.set(banks)
            this.navigationService.loadBarFinish()
        })
    }

    fetchCount() {
        this.banksService.getCountBanks().subscribe(count => {
            this.$length.set(count)
        })
    }

}
