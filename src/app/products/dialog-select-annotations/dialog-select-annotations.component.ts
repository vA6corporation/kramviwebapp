import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { BoardsService } from '../../boards/boards.service'
import { SalesService } from '../../sales/sales.service'
import { MaterialModule } from '../../material.module'
import { ProductModel } from '../product.model'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { OfficeModel } from '../../offices/office.model'

@Component({
    selector: 'app-dialog-select-annotations',
    imports: [MaterialModule],
    templateUrl: './dialog-select-annotations.component.html',
    styleUrls: ['./dialog-select-annotations.component.sass']
})
export class DialogSelectAnnotationsComponent {

    private readonly product: ProductModel = inject(MAT_DIALOG_DATA)
    private readonly dialogRef: MatDialogRef<DialogSelectAnnotationsComponent> = inject(MatDialogRef)
    private readonly boardsService = inject(BoardsService)
    private readonly salesService = inject(SalesService)
    private readonly authService = inject(AuthService)

    $annotations = signal<string[]>([])
    selectedAnnotations: string[] = []

    ngOnInit(): void {
        this.$annotations.set(Array.from(this.product.annotations))
    }

    onSelectAnnotation(annotation: string) {
        const index = this.selectedAnnotations.indexOf(annotation)
        if (index > -1) {
            this.selectedAnnotations.splice(index, 1)
        } else {
            this.selectedAnnotations.push(annotation)
        }
    }

    onSubmit() {
        this.boardsService.addBoardItem(this.product, this.selectedAnnotations.join())
        this.salesService.addSaleItem(this.product, this.selectedAnnotations.join())
        this.dialogRef.close()
    }

}
