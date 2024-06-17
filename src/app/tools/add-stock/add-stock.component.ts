import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { parseExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PriceListModel } from '../../products/price-list.model';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { ToolsService } from '../tools.service';

@Component({
    selector: 'app-add-stock',
    templateUrl: './add-stock.component.html',
    styleUrls: ['./add-stock.component.sass']
})
export class AddStockComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly authService: AuthService,
        private readonly toolsService: ToolsService,
    ) { }

    displayedColumns: string[] = [
        'sku',
        'upc',
        'name',
        'feature',
        'brand',
        'category',
        'description',
        'stock',
        'cost',
    ]
    dataSource: any[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    isLoading: boolean = false
    priceLists: PriceListModel[] = []
    setting: SettingModel = new SettingModel()
    private paymentMethodId: string = ''

    private handleAuth$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethodId = (paymentMethods[0] || { _id: '' })._id
        })
    }

    async onFileSelected(files: FileList | null, input: HTMLInputElement, table: MatTable<any>) {
        if (files && files[0]) {
            const products = await parseExcel(files[0])
            input.value = ''
            this.dataSource = []
            for (const product of products) {
                if (product.nombre && product.stock && product.codigo || product.codigoInterno) {
                    const importProduct: any = {
                        name: product.nombre,
                        feature: product.variante,
                        brand: product.marca,
                        category: product.categoria,
                        description: product.descripcion,
                        stock: product.stock,
                        price: isNaN(product.precioVenta) ? 0 : Number(product.precioVenta.toFixed(2)),
                        cost: isNaN(product.precioCompra) ? 0 : Number(product.precioCompra.toFixed(2)),
                        sku: product.codigoInterno,
                        upc: product.codigo
                    }

                    this.dataSource.push(importProduct)
                }
            }
            table.renderRows()
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.specialtiesService.getSpecialtiesByPage(event.pageIndex + 1, event.pageSize).subscribe(specialties => {
            this.dataSource = specialties
        })
    }

    onDeleteCustomer(index: number, table: MatTable<any>) {
        this.dataSource.splice(index, 1)
        table.renderRows()
    }

    async onSubmit() {
        this.navigationService.loadBarStart()
        this.isLoading = true
        let chunk = 500
        const promises: any[] = []
        for (let index = 0; index < this.dataSource.length; index += chunk) {
            const temporary = this.dataSource.slice(index, index + chunk)
            const promise = lastValueFrom(this.toolsService.addStock(temporary, this.paymentMethodId))
            promises.push(promise)
        }
        try {
            await Promise.all(promises)
            this.navigationService.showMessage('Subido correctamente')
            this.dataSource = []
            this.isLoading = false
            this.navigationService.loadBarFinish()
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.navigationService.showMessage(error.error.message)
            } else {
                this.navigationService.showMessage('Error desconocido')
            }
            this.navigationService.loadBarFinish()
            this.isLoading = false
        }
    }

}
