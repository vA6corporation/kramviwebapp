import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpService } from '../../http.service';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { formatDate } from '@angular/common';
import { buildExcel } from '../../buildExcel';

@Component({
    selector: 'app-delete-data',
    imports: [MaterialModule],
    templateUrl: './delete-data.component.html',
    styleUrls: ['./delete-data.component.sass']
})
export class DeleteDataComponent {

    constructor(
        private readonly httpService: HttpService,
        private readonly navigationService: NavigationService,
    ) { }

    onDeleteProducts() {
        this.navigationService.loadBarStart()
        this.httpService.delete(`tools/deleteProducts`).subscribe({
            next: () => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Productos eliminados')
                setTimeout(() => {
                    location.reload()
                }, 3000)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onDeletePurchases() {
        this.navigationService.loadBarStart()
        this.httpService.delete(`tools/deletePurchases`).subscribe({
            next: () => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Compras eliminados')
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onResetStock() {
        const ok = confirm('Esta seguro de reiniciar el stock')
        if (ok) {
            this.navigationService.loadBarStart()
            this.httpService.get('tools/resetStock').subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Stock reiniciado')
            })
        }
    }

    onLastThreeYears() {
        this.navigationService.loadBarStart()
        this.httpService.get('customers/lastThreeYears').subscribe(customers => {
            this.navigationService.loadBarFinish()
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'T. DOCUMENTO',
                'DOCUMENTO',
                'NOMBRES/R. SOCIAL',
                'DIRECCION',
                'EMAIL',
                'CELULAR',
            ])
            for (const customer of customers) {
                body.push([
                    customer.documentType,
                    customer.document,
                    customer.name.toUpperCase(),
                    customer.addresses[0],
                    customer.email,
                    customer.mobileNumber,
                ])
            }
            const name = `CLIENTES`
            buildExcel(body, name, wscols, [])
        })
    }

}
