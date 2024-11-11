import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-message',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './dialog-message.component.html',
    styleUrls: ['./dialog-message.component.sass']
})
export class DialogMessageComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly message: string,
    ) { }

}
