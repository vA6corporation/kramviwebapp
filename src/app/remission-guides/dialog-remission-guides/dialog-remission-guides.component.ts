import { Component, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { PrintService } from '../../print/print.service'
import { RemissionGuideModel } from '../remission-guide.model'
import { RemissionGuidesService } from '../remission-guides.service'

@Component({
    selector: 'app-dialog-remission-guides',
    imports: [MaterialModule, RouterModule],
    templateUrl: './dialog-remission-guides.component.html',
    styleUrls: ['./dialog-remission-guides.component.sass'],
})
export class DialogRemissionGuidesComponent {

    readonly saleId: number = inject(MAT_DIALOG_DATA)
    private readonly remissionGuidesService = inject(RemissionGuidesService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)
    private readonly printService = inject(PrintService)
    private readonly dialogRef: MatDialogRef<DialogRemissionGuidesComponent> = inject(MatDialogRef)

    remissionGuides: RemissionGuideModel[] = []
    office: OfficeModel = new OfficeModel()

    private handleAuth$eAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$eAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$eAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.remissionGuidesService.getRemissionGuidesBySale(this.saleId).subscribe({
            next: remissionGuides => {
                this.remissionGuides = remissionGuides
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onPrintRemissionGuide(remissionGuideId: any) {
        this.dialogRef.close()
        this.remissionGuidesService.getRemissionGuideById(remissionGuideId).subscribe(remissionGuide => {
            this.printService.printA4RemissionGuide(remissionGuide)
        })
    }
}
