import { Component, inject } from '@angular/core'
import { ToolsService } from '../tools.service'
import { MaterialModule } from '../../material.module'
import { DialogAdminComponent, DialogAdminData } from '../../sales/dialog-admin/dialog-admin.component'
import { MatDialog } from '@angular/material/dialog'
import { NavigationService } from '../../navigation/navigation.service'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
    selector: 'app-duplicate-invoices',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './duplicate-invoices.component.html',
    styleUrl: './duplicate-invoices.component.sass'
})
export class DuplicateInvoicesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly toolsService = inject(ToolsService)

    duplicates: any[] = []
    missings: any[] = []
    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '',
    })

    fetchData() {
        const { invoiceCode } = this.formGroup.value
        if (invoiceCode) {
            this.navigationService.loadBarStart()
            this.toolsService.getDuplicates(invoiceCode).subscribe(res => {
                this.navigationService.loadBarFinish()
                const { duplicates, missings } = res
                this.missings = missings
                this.duplicates = duplicates.sort((a: any, b: any) => {
                    if (a.invoiceNumber > b.id) {
                        return 1
                    }
                    if (a.id < b.id) {
                        return -1
                    }
                    return 0
                })
            })
        }
    }

    onSelectSale(saleId: any) {
        const data: DialogAdminData = {
            saleId,
            saleIds: []
        }

        const dialogRef = this.matDialog.open(DialogAdminComponent, {
            width: '600px',
            position: { top: '20px' },
            data,
        })

        dialogRef.componentInstance.handleUpdate().subscribe(() => {
            this.fetchData()
        })
    }

}
