import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-sheet-incidents',
    imports: [MaterialModule, RouterModule],
    templateUrl: './sheet-incidents.component.html',
    styleUrl: './sheet-incidents.component.sass'
})
export class SheetIncidentsComponent {

    constructor(
        private readonly bottomSheetRef: MatBottomSheetRef<SheetIncidentsComponent>,
        private readonly  router: Router,
    ) { }

    onClose(path: string) {
        this.router.navigate([path])
        this.bottomSheetRef.dismiss()
    }

}
