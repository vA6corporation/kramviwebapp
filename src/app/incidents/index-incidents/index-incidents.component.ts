import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { InIncidentsComponent } from '../in-incidents/in-incidents.component';
import { OutIncidentsComponent } from '../out-incidents/out-incidents.component';

@Component({
  selector: 'app-index-incidents',
  imports: [MaterialModule, InIncidentsComponent, OutIncidentsComponent],
  templateUrl: './index-incidents.component.html',
  styleUrl: './index-incidents.component.sass'
})
export class IndexIncidentsComponent {

}
