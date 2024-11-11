import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { CustomerModel } from '../customer.model';
import { CustomersService } from '../customers.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-deleted-customers',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './deleted-customers.component.html',
    styleUrls: ['./deleted-customers.component.sass']
})
export class DeletedCustomersComponent {

    constructor(
        private readonly customersService: CustomersService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    displayedColumns: string[] = ['document', 'name', 'address', 'email', 'mobileNumber', 'actions']
    dataSource: CustomerModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Clientes')

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.fetchData()

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.customersService.getCustomersByKey(key).subscribe(customers => {
                this.dataSource = customers
            }, (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            })
        })
    }

    handlePageEvent(event: PageEvent): void {
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

    onLocationChange() {
        this.fetchData()
    }

    fetchData() {
        this.customersService.getDeletedCustomersCount().subscribe(count => {
            this.length = count
        })

        this.navigationService.loadBarStart()
        this.customersService.getDeletedCustomersByPage(this.pageIndex + 1, this.pageSize).subscribe(customers => {
            this.navigationService.loadBarFinish()
            this.dataSource = customers
        })
    }

    onRestore(customerId: string) {
        const ok = confirm('Esta seguro de restaurar?...')
        if (ok) {
            this.customersService.restore(customerId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Restaurado correctamente')
                    this.fetchData()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
