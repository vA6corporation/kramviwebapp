import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { PageEvent } from '@angular/material/paginator'
import { MatTable } from '@angular/material/table'
import { Subscription, lastValueFrom } from 'rxjs'
import { parseExcel } from '../../buildExcel'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { PriceListModel } from '../../products/price-list.model'
import { ToolsService } from '../tools.service'

@Component({
    selector: 'app-import-stock',
    imports: [MaterialModule, CommonModule],
    templateUrl: './import-stock.component.html',
    styleUrl: './import-stock.component.sass',
})
export class ImportStockComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly toolsService = inject(ToolsService)

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
    $dataSource = signal<any[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $isLoading = signal<boolean>(false)
    private paymentMethodId: any = 0

    private handleAuth$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethodId = (paymentMethods[0] || { id: 0 }).id
        })
    }

    async onFileSelected(files: FileList | null, input: HTMLInputElement, table: MatTable<any>) {
        if (files && files[0]) {
            const products = await parseExcel(files[0])
            input.value = ''
            this.$dataSource.set([])
            for (const product of products) {
                if (product.nombre && product.stock && product.stock > 0) {
                    const importProduct: any = {
                        name: product.nombre,
                        feature: product.variante,
                        brand: product.marca,
                        category: product.categoria,
                        description: product.descripcion,
                        stock: product.stock,
                        price: isNaN(product.precio) ? 0 : Number(product.precio),
                        cost: isNaN(product.costo) ? 0 : Number(product.costo),
                        sku: product.codigoInterno,
                        upc: product.codigo
                    }

                    this.$dataSource.update(values => [...values, importProduct])
                }
            }
            table.renderRows()
        }
    }

    handlePageEvent(event: PageEvent): void {
    }

    onDeleteProduct(index: number, table: MatTable<any>) {
        this.$dataSource.update(values => {
            values.splice(index, 1)
            return values
        })
        table.renderRows()
    }

    async onSubmit() {
        this.navigationService.loadBarStart()
        this.$isLoading.set(true)
        let chunk = 500
        const promises: any[] = []
        for (let index = 0; index < this.$dataSource().length; index += chunk) {
            const temporary = this.$dataSource().slice(index, index + chunk)
            const promise = lastValueFrom(this.toolsService.importStock(temporary))
            promises.push(promise)
        }
        try {
            await Promise.all(promises)
            this.navigationService.showMessage('Subido correctamente')
            this.$dataSource.set([])
            this.$isLoading.set(false)
            this.navigationService.loadBarFinish()
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.navigationService.showMessage(error.error.message)
            } else {
                this.navigationService.showMessage('Error desconocido')
            }
            this.navigationService.loadBarFinish()
            this.$isLoading.set(false)
        }
    }

}
