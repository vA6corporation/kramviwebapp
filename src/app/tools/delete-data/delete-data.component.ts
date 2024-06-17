import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-delete-data',
  templateUrl: './delete-data.component.html',
  styleUrls: ['./delete-data.component.sass']
})
export class DeleteDataComponent implements OnInit {

  constructor(
    private readonly httpService: HttpService,
    private readonly navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
  }

  onDeleteProducts() {
    this.navigationService.loadBarStart();
    this.httpService.delete(`tools/deleteProducts`).subscribe(() => {
      this.navigationService.loadBarFinish();
      this.navigationService.showMessage('Productos eliminados');
      location.reload();
    }, (error: HttpErrorResponse) => {
      this.navigationService.loadBarFinish();
      this.navigationService.showMessage(error.error.message);
    });
  }

  onResetStock() {
    const ok = confirm('Esta seguro de reiniciar el stock');
    if (ok) {
      this.navigationService.loadBarStart();
      this.httpService.get('tools/resetStock').subscribe(() => {
        this.navigationService.loadBarFinish();
        this.navigationService.showMessage('Stock reiniciado');
      });
    }
  }

}
