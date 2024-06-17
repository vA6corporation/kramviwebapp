import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-index-kitchen',
  templateUrl: './index-kitchen.component.html',
  styleUrls: ['./index-kitchen.component.sass']
})
export class IndexKitchenComponent implements OnInit {

  constructor(
    private readonly navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.navigationService.setTitle('Dashboard');
  }


}
