import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { PageEvent } from '@angular/material/paginator'
import { MatTable } from '@angular/material/table'
import { Subscription, lastValueFrom } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { parseExcel } from '../../buildExcel'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { PriceListModel } from '../../products/price-list.model'
import { PriceType } from '../../products/price-type.enum'
import { ProductsService } from '../../products/products.service'
import { ToolsService } from '../tools.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { OfficeModel } from '../../offices/office.model'

@Component({
    selector: 'app-import-products',
    imports: [MaterialModule, CommonModule],
    templateUrl: './import-products.component.html',
    styleUrls: ['./import-products.component.sass']
})
export class ImportProductsComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly productsService = inject(ProductsService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly authService = inject(AuthService)
    private readonly toolsService = inject(ToolsService)

    displayedColumns: string[] = [
        'name',
        'brand',
        'category',
        'stock',
        'unidad',
    ]
    $dataSource = signal<any[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $isLoading = signal<boolean>(false)
    priceLists: PriceListModel[] = []
    offices: OfficeModel[] = []
    setting: SettingModel = new SettingModel()
    private paymentMethodId: any = 0

    private handleAuth$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()


    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleOffices$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting

            if (this.setting.defaultPrice === PriceType.GLOBAL) {
                this.displayedColumns.push('price')
            }

            if (this.setting.defaultPrice === PriceType.OFICINA) {
                this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
                    this.offices = offices
                    for (const office of this.offices) {
                        this.displayedColumns.push(office.name)
                    }
                })
            }

            this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                this.priceLists = priceLists
                for (const priceList of this.priceLists) {
                    this.displayedColumns.push(priceList.name)
                }
            })
        })

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
                let expirationAt = null
                if (product.fechaVencimiento) {
                    const dates = String(product.fechaVencimiento).split('/')
                    expirationAt = new Date(Number(dates[2]), Number(dates[1]), Number(dates[0]))
                }
                if (product.nombre && product.categoria) {
                    const importProduct: any = {
                        printZone: (product.zonaImpresion || 'COCINA').toUpperCase(),
                        name: product.nombre,
                        feature: product.variante,
                        brand: product.marca,
                        category: product.categoria,
                        description: product.descripcion,
                        stock: product.stock,
                        price: isNaN(product.precio) ? 0 : Number(product.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                        cost: isNaN(product.costo) ? 0 : Number(product.costo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                        upc: String(product.codigo || ''),
                        sku: String(product.codigoInterno || ''),
                        unidad: product.unidad || 'UNIDADES',
                        expirationAt,
                        providerName: product.nombreProveedor || '',
                        providerDocument: product.documentoProveedor || '',
                    }

                    for (const priceList of this.priceLists) {
                        importProduct[priceList.name.toLowerCase()] = Number(product[priceList.name] || product[priceList.name.toLowerCase()] || importProduct.price || 0)
                    }

                    for (const office of this.offices) {
                        importProduct[office.name.toLowerCase()] = Number(product[office.name])
                    }

                    this.$dataSource.update(values => [...values, importProduct])
                }
            }
            if (products.find(e => e.codigo || e.codigoInterno)) {
                this.displayedColumns.unshift('sku')
                this.displayedColumns.unshift('upc')
            }
            if (products.find(e => e.nombreProveedor || e.documentoProveedor)) {
                this.displayedColumns.push('providerName')
                this.displayedColumns.push('providerDocument')
            }
            if (products.find(e => e.costo)) {
                this.displayedColumns.push('cost')

            }
            if (products.find(e => e.variante)) {
                this.displayedColumns.splice(1, 0, 'feature')
            }
            this.displayedColumns.push('actions')
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
        const chunk = 500
        const promises: any[] = []
        for (let index = 0; index < this.$dataSource().length; index += chunk) {
            const temporary = this.$dataSource().slice(index, index + chunk)
            const promise = lastValueFrom(this.toolsService.importProducts(temporary, this.priceLists, this.setting.defaultPrice, this.paymentMethodId))
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
