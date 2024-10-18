import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpService } from '../../http.service';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
    selector: 'app-delete-data',
    standalone: true,
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
                location.reload()
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

}
