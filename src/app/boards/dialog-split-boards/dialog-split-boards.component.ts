import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-dialog-split-boards',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dialog-split-boards.component.html',
  styleUrl: './dialog-split-boards.component.sass'
})
export class DialogSplitBoardsComponent {

    onSelectProduct() {
        
    }

}
