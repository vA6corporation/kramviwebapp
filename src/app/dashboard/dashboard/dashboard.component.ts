import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(
    private readonly navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.navigationService.setTitle('Dashboard');
  }

}
