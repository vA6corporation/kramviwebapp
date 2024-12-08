import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { parseExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { ToolsService } from '../tools.service';
import { lastValueFrom } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-update-prices',
    imports: [MaterialModule, CommonModule],
    templateUrl: './update-prices.component.html',
    styleUrls: ['./update-prices.component.sass']
})
export class UpdatePricesComponent {

    constructor(
        private readonly specialtiesService: SpecialtiesService,
        private readonly toolsService: ToolsService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['sku', 'upc', 'name', 'feature', 'brand', 'category', 'stock', 'price', 'cost', 'actions'];
    dataSource: any[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;
    isLoading: boolean = false;

    async onFileSelected(files: FileList | null, input: HTMLInputElement, table: MatTable<any>) {
        if (files && files[0]) {
            const products = await parseExcel(files[0]);
            input.value = '';
            this.dataSource = [];
            for (const product of products) {
                if (product.nombre) {
                    this.dataSource.push({
                        name: product.nombre,
                        feature: product.variante,
                        brand: product.marca,
                        category: product.categoria,
                        stock: product.stock,
                        price: isNaN(product.precioVenta) ? 0 : Number(product.precioVenta.toFixed(2)),
                        cost: isNaN(product.precioCompra) ? 0 : Number(product.precioCompra.toFixed(2)),
                        sku: product.codigoInterno,
                        upc: product.codigo
                    });
                }
            }
            table.renderRows();
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.specialtiesService.getSpecialtiesByPage(event.pageIndex + 1, event.pageSize).subscribe(specialties => {
            this.dataSource = specialties;
        });
    }

    onDeleteCustomer(index: number, table: MatTable<any>) {
        this.dataSource.splice(index, 1);
        table.renderRows();
    }

    async onSubmit() {
        this.navigationService.loadBarStart();
        this.isLoading = true;
        let chunk = 500;
        for (let index = 0; index < this.dataSource.length; index += chunk) {
            const temporary = this.dataSource.slice(index, index + chunk);
            try {
                await lastValueFrom(this.toolsService.updatePrices(temporary))
            } catch (error) {
                console.log(error);
            }
        }
        this.navigationService.showMessage('Subido correctamente');
        this.dataSource = [];
        this.isLoading = false;
        this.navigationService.loadBarFinish();
    }

}
