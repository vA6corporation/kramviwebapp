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
import { PriceType } from '../../products/price-type.enum';
import { ProductsService } from '../../products/products.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { ToolsService } from '../tools.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-import-products',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './import-products.component.html',
    styleUrls: ['./import-products.component.sass']
})
export class ImportProductsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly productsService: ProductsService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly authService: AuthService,
        private readonly toolsService: ToolsService,
    ) { }

    displayedColumns: string[] = [
        'name',
        // 'feature',
        'brand',
        'category',
        // 'description',
        'stock',
        'unidad',
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

            if (this.setting.defaultPrice === PriceType.GLOBAL) {
                this.displayedColumns.push('price')
            } else {
            }

            this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                this.priceLists = priceLists
                for (const priceList of this.priceLists) {
                    this.displayedColumns.push(priceList.name)
                }
            })
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
                        price: isNaN(product.precio) ? 0 : Number(product.precio.toFixed(2)),
                        cost: isNaN(product.costo) ? 0 : Number(product.costo.toFixed(2)),
                        upc: String(product.codigo || ''),
                        sku: String(product.codigoInterno || ''),
                        unidad: product.unidad || 'UNIDADES',
                        expirationAt,
                        lotNumber: product.lote || null,
                        providerName: product.nombreProveedor || '',
                        providerDocument: product.documentoProveedor || '',
                    }

                    for (const priceList of this.priceLists) {
                        importProduct[priceList.name.toLowerCase()] = Number(product[priceList.name] || product[priceList.name.toLowerCase()] || importProduct.price || 0)
                    }

                    this.dataSource.push(importProduct)
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
            if (products.find(e => e.fechaVencimiento)) {
                this.displayedColumns.push('expirationAt')
                this.displayedColumns.push('lotNumber')
            }
            if (products.find(e => e.variante)) {
                this.displayedColumns.splice(1, 0, 'feature')
            }
            this.displayedColumns.push('actions')
            table.renderRows()
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.specialtiesService.getSpecialtiesByPage(event.pageIndex + 1, event.pageSize).subscribe(specialties => {
            this.dataSource = specialties
        })
    }

    onDeleteProduct(index: number, table: MatTable<any>) {
        this.dataSource.splice(index, 1)
        table.renderRows()
    }

    async onSubmit() {
        this.navigationService.loadBarStart()
        this.isLoading = true
        const chunk = 500
        const promises: any[] = []
        for (let index = 0; index < this.dataSource.length; index += chunk) {
            const temporary = this.dataSource.slice(index, index + chunk)
            const promise = lastValueFrom(this.toolsService.importProducts(temporary, this.priceLists, this.setting.defaultPrice, this.paymentMethodId))
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
