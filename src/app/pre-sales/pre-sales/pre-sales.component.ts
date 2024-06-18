import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { CreateSaleItemModel } from '../../sales/create-sale-item.model';
import { SalesService } from '../../sales/sales.service';
import { PreSaleModel } from '../pre-sale.model';
import { PreSalesService } from '../pre-sales.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pre-sales',
    standalone: true,
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './pre-sales.component.html',
    styleUrls: ['./pre-sales.component.sass']
})
export class PreSalesComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly preSalesService: PreSalesService,
        private readonly salesService: SalesService,
        private readonly router: Router,
    ) { }

    preSales: PreSaleModel[] = []

    ngOnInit(): void {
        this.navigationService.setTitle('Pre ventas')
        this.salesService.setSaleItems([])
        this.fetchData()
    }

    checkHours(createdAt: string): string {
        const date = new Date(createdAt)
        const currentDate = new Date()
        const dif = Math.abs(currentDate.getTime() - date.getTime())
        let minutes = Math.round((dif / 1000) / 60)
        if (minutes > 60) {
            let hours = 0
            while (minutes > 60) {
                hours++
                minutes -= 60
            }
            if (minutes > 9) {
                return `${hours}:${minutes}`
            } else {
                return `${hours}:0${minutes}`
            }
        } else {
            if (minutes > 9) {
                return `0:${minutes}`
            } else {
                return `0:0${minutes}`
            }
        }
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.preSalesService.getPreSales().subscribe(preSales => {
            this.navigationService.loadBarFinish()
            this.preSales = preSales
        })
    }

    onEdit(preSale: PreSaleModel) {
        const saleItems: CreateSaleItemModel[] = []
        for (const preSaleItem of preSale.preSaleItems) {
            const saleItem: CreateSaleItemModel = {
                fullName: preSaleItem.fullName,
                onModel: preSaleItem.onModel,
                price: preSaleItem.price,
                quantity: preSaleItem.quantity,
                preIgvCode: preSaleItem.igvCode,
                igvCode: preSaleItem.igvCode,
                unitCode: preSaleItem.unitCode,
                isTrackStock: preSaleItem.isTrackStock,
                observations: preSaleItem.observations,
                prices: [],
                productId: preSaleItem.productId,
            }
            saleItems.push(saleItem)
        }
        this.salesService.setSaleItems(saleItems)
        this.preSalesService.setPreSale(preSale)
        this.router.navigate([`/preSales/posPreSaleEdit`])
    }

    onCharge(preSale: PreSaleModel) {
        const saleItems: CreateSaleItemModel[] = []
        for (const preSaleItem of preSale.preSaleItems) {
            const saleItem: CreateSaleItemModel = {
                fullName: preSaleItem.fullName,
                onModel: preSaleItem.onModel,
                price: preSaleItem.price,
                quantity: preSaleItem.quantity,
                preIgvCode: preSaleItem.igvCode,
                igvCode: preSaleItem.igvCode,
                unitCode: preSaleItem.unitCode,
                isTrackStock: preSaleItem.isTrackStock,
                observations: preSaleItem.observations,
                prices: [],
                productId: preSaleItem.productId,
            }
            saleItems.push(saleItem)
        }
        this.salesService.setSaleItems(saleItems)
        this.preSalesService.setPreSale(preSale)
        this.router.navigate([`/preSales/charge`])
    }

    onDelete(preSaleId: string) {
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.preSalesService.delete(preSaleId).subscribe(() => {
                this.fetchData()
                this.navigationService.loadBarFinish()
            })
        }
    }

}
