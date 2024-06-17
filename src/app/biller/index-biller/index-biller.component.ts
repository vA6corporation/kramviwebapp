import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-index-biller',
  templateUrl: './index-biller.component.html',
  styleUrls: ['./index-biller.component.sass']
})
export class IndexBillerComponent implements OnInit {

  constructor(
    private readonly navigationSerivce: NavigationService,
  ) { }

  ngOnInit(): void {
    this.navigationSerivce.setTitle('Facturador');
  }

}
