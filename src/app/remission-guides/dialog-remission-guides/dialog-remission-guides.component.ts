import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { RemissionGuideModel } from '../remission-guide.model';
import { RemissionGuidesService } from '../remission-guides.service';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dialog-remission-guides',
    imports: [MaterialModule, RouterModule],
    templateUrl: './dialog-remission-guides.component.html',
    styleUrls: ['./dialog-remission-guides.component.sass'],
})
export class DialogRemissionGuidesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly saleId: string,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
        private readonly dialogRef: MatDialogRef<DialogRemissionGuidesComponent>
    ) { }

    remissionGuides: RemissionGuideModel[] = []
    office: OfficeModel = new OfficeModel()
    setting: SettingModel = new SettingModel()

    private handleAuth$eAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$eAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$eAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
        })

        this.remissionGuidesService.getRemissionGuidesBySale(this.saleId).subscribe({
            next: remissionGuides => {
                this.remissionGuides = remissionGuides
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onPrintRemissionGuide(remissionGuideId: string) {
        this.dialogRef.close()
        this.remissionGuidesService.getRemissionGuideById(remissionGuideId).subscribe(remissionGuide => {
            this.printService.printA4RemissionGuide(remissionGuide)
        })
    }
}
