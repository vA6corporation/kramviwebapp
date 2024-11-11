import { Component } from '@angular/core';
import { PaymentMethodsService } from '../payment-methods.service';
import { NavigationService } from '../../navigation/navigation.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserModel } from '../../users/user.model';
import { PaymentMethodModel } from '../payment-method.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-disabled-payment-methods',
    templateUrl: './disabled-payment-methods.component.html',
    styleUrls: ['./disabled-payment-methods.component.sass']
})
export class DisabledPaymentMethodsComponent {

    constructor(
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    users: UserModel[] = []
    displayedColumns: string[] = ['name', 'actions']
    dataSource: PaymentMethodModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Medios de pago')
        this.fetchData()
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
    }

    fetchData() {
        this.navigationService.loadBarFinish()
        this.paymentMethodsService.getDisabledPaymentMethods().subscribe({
            next: paymentMethods => {
                this.dataSource = paymentMethods
                this.navigationService.loadBarFinish()
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onRestore(paymentMethod: PaymentMethodModel) {
        const ok = confirm('Esta seguro de restaurar?...')
        if (ok) {
            paymentMethod.deletedAt = null
            this.navigationService.loadBarStart()
            this.paymentMethodsService.update(paymentMethod, paymentMethod._id).subscribe(() => {
                this.navigationService.showMessage('Restaurado correctamente')
                this.navigationService.loadBarFinish()
                this.fetchData()
            })
        }
    }

}
