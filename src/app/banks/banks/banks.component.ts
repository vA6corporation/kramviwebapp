import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { BankModel } from '../../providers/bank.model';
import { UserModel } from '../../users/user.model';
import { BanksService } from '../banks.service';

@Component({
    selector: 'app-banks',
    standalone: true,
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './banks.component.html',
    styleUrls: ['./banks.component.sass']
})
export class BanksComponent {

    constructor(
        private readonly banksService: BanksService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    users: UserModel[] = []
    displayedColumns: string[] = ['bankName', 'currencyName', 'accountNumber', 'cci', 'actions']
    dataSource: BankModel[] = []
    length: number = 0
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

    onDelete(bankId: string) {
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
            this.dataSource = banks
            this.navigationService.loadBarFinish()
        })
    }

    fetchCount() {
        this.banksService.getCountBanks().subscribe(count => {
            this.length = count
        })
    }

}
