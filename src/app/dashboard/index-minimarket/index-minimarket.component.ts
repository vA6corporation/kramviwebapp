import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-index-minimarket',
  templateUrl: './index-minimarket.component.html',
  styleUrls: ['./index-minimarket.component.sass']
})
export class IndexMinimarketComponent implements OnInit {

  constructor(
    private readonly navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.navigationService.setTitle('Dashboard');
  }


}
