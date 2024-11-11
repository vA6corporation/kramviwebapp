import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { PaymentMethodModel } from '../payment-method.model';
import { PaymentMethodsService } from '../payment-methods.service';

@Component({
    selector: 'app-payment-methods',
    templateUrl: './payment-methods.component.html',
    styleUrls: ['./payment-methods.component.sass']
})
export class PaymentMethodsComponent {

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
        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.dataSource = paymentMethods
            this.navigationService.loadBarFinish()
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message)
        })
    }

    onDelete(paymentMethodId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.paymentMethodsService.delete(paymentMethodId).subscribe(() => {
                this.navigationService.showMessage('Eliminado correctamente')
                this.dataSource = this.dataSource.filter(e => e._id !== paymentMethodId)
            })
        }
    }

}
