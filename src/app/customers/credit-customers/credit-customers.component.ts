import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { CreditModel } from '../../credits/credit.model';
import { CreditsService } from '../../credits/credits.service';
import { DialogPaymentCreditsComponent } from '../../credits/dialog-payment-credits/dialog-payment-credits.component';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { CustomerModel } from '../customer.model';
import { CustomersService } from '../customers.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-credit-customers',
    standalone: true,
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './credit-customers.component.html',
    styleUrls: ['./credit-customers.component.sass']
})
export class CreditCustomersComponent {

    constructor(
        private readonly creditsService: CreditsService,
        private readonly customersService: CustomersService,
        private readonly turnsService: TurnsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
    ) { }

    displayedColumns: string[] = ['checked', 'createdAt', 'serial', 'charge', 'remaining', 'actions']
    dataSource: CreditModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
    charge: number = 0
    selectedCredits: CreditModel[] = []
    forPaid: number = 0
    customer: CustomerModel | null = null
    private customerId: string = ''
    private turn: TurnModel | null = null
    private setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()
    private handleTurns$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleTurns$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {

        this.navigationService.setMenu([
            { id: 'print_customer_credits', label: 'Imprimir cuenta', icon: 'printer', show: false },
            { id: 'export_customer_credits', label: 'Exportar cuenta PDF', icon: 'file_download', show: false },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting

            this.handleTurns$ = this.turnsService.handleOpenTurn(this.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
            })
        })

        this.customerId = this.activatedRoute.snapshot.params['customerId']
        this.customersService.getCustomerById(this.customerId).subscribe(customer => {
            this.customer = customer
            this.navigationService.setTitle(`Creditos ${customer.name}`)
        })
        this.fetchData()

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'print_customer_credits': {
                    if (this.customer) {
                        this.printService.printCreditCustomer80mm(this.customer, this.dataSource)
                    }
                    break
                }
                case 'export_customer_credits': {
                    if (this.customer) {
                        this.printService.exportPdfCreditCustomer80mm(this.customer, this.dataSource)
                    }
                    break
                }
            }
        })
    }

    updateSelectedPayment() {
        const selectedPayed = this.selectedCredits.map(e => e.payed).reduce((a, b) => a + b, 0)
        const selectedCharge = this.selectedCredits.map(e => e.charge).reduce((a, b) => a + b, 0)
        this.forPaid = selectedCharge - selectedPayed
    }

    onCheck(isChecked: boolean, credit: CreditModel) {
        if (isChecked) {
            this.selectedCredits.push(credit)
        } else {
            const index = this.selectedCredits.indexOf(credit)
            if (index > -1) {
                this.selectedCredits.splice(index, 1)
            }
        }
        this.updateSelectedPayment()
    }

    onCheckAll(isChecked: boolean) {
        if (isChecked) {
            this.selectedCredits = this.dataSource
        } else {
            this.selectedCredits = []
        }
        this.updateSelectedPayment()
    }

    onPayment() {
        if (this.turn) {
            const dialogRef = this.matDialog.open(DialogPaymentCreditsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.selectedCredits
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                }
            })
        } else {
            const dialogRef = this.matDialog.open(DialogTurnsComponent, {
                width: '600px',
                position: { top: '20px' }
            })

            dialogRef.afterClosed().subscribe(() => {
                const dialogRef = this.matDialog.open(DialogPaymentCreditsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                    data: this.selectedCredits
                })

                dialogRef.afterClosed().subscribe(ok => {
                    if (ok) {
                        this.fetchData()
                    }
                })
            })
        }
    }

    handlePageEvent(event: PageEvent): void {
        const { pageIndex, pageSize } = event
        this.pageIndex = pageIndex
        this.pageSize = pageSize
        this.fetchData()
    }

    onOpenDetails(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.creditsService.getCreditsByCustomer(this.customerId).subscribe(credits => {
            this.navigationService.loadBarFinish()
            this.dataSource = credits
            this.selectedCredits = []
            this.updateSelectedPayment()
            this.charge = 0
            for (const credit of credits) {
                this.charge += (credit.charge - credit.payed)
            }
        })
    }

}
