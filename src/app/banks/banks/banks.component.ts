import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { BankModel } from '../../providers/bank.model';
import { UserModel } from '../../users/user.model';
import { BanksService } from '../banks.service';

@Component({
    selector: 'app-banks',
    templateUrl: './banks.component.html',
    styleUrls: ['./banks.component.sass']
})
export class BanksComponent implements OnInit {

    constructor(
        private readonly banksService: BanksService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    users: UserModel[] = [];
    displayedColumns: string[] = ['bankName', 'currencyName', 'accountNumber', 'cci', 'actions'];
    dataSource: BankModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;

    ngOnInit(): void {
        this.navigationService.setTitle('Cuentas bancarias');
        this.fetchData();
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart();
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize };

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
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
        this.navigationService.loadBarStart();
        this.banksService.getBanks().subscribe(banks => {
            this.dataSource = banks;
            this.navigationService.loadBarFinish();
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message);
        });
    }

}
