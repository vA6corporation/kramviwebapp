import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { RoomModel } from '../../rooms/room.model';
import { RoomsService } from '../../rooms/rooms.service';
import { ReceptionModel } from '../reception.model';
import { ReceptionsService } from '../receptions.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-pos-reception',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './pos-reception.component.html',
    styleUrls: ['./pos-reception.component.sass']
})
export class PosReceptionComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly receptionsService: ReceptionsService,
        private readonly roomsService: RoomsService,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
    ) { }

    room: RoomModel | null = null
    reception: ReceptionModel | null = null
    customer: CustomerModel | null = null
    customers: CustomerModel[] = []
    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
        observations: '',
        charge: [null, Validators.required]
    })
    receptionId: string = ''
    saleId: string | null = null
    isLoading: boolean = true
    private roomId: string = ''

    ngOnInit(): void {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        this.formGroup.get('endDate')?.patchValue(tomorrow)
        this.roomId = this.activatedRoute.snapshot.params['roomId']
        this.navigationService.loadBarStart()
        this.roomsService.getRoomById(this.roomId).subscribe({
            next: room => {
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.room = room
                this.reception = room.reception
                this.receptionsService.setRoom(this.room)

                if (this.reception) {
                    this.customers = this.reception.customers
                    this.receptionId = this.reception._id
                    this.saleId = this.reception.saleId
                    this.formGroup.patchValue(this.reception)
                    this.receptionsService.setReception(this.reception)
                    this.receptionsService.setCustomers(this.reception.customers)
                } else {
                    this.formGroup.get('charge')?.patchValue(this.room.price)
                }
                this.navigationService.setTitle(`Habitacion N° ${room.roomNumber}`)
            }, error: (error: HttpErrorResponse) => {
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onCheckOut() {
        this.navigationService.loadBarStart()
        this.receptionsService.checkOut(this.receptionId).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.router.navigate(['/receptions'])
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

    onCleaned() {
        this.navigationService.loadBarStart()
        this.receptionsService.cleaned(this.receptionId).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.router.navigate(['/receptions'])
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

    onAddCustomer() {
        const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: 'DNI'
        })

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.customers.push(customer)
            }
        })

        dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
            const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(customer => {
                if (customer) {
                    this.customers.push(customer)
                }
            })
        })
    }

    onDeleteCustomer(customerId: string) {
        this.customers = this.customers.filter(e => e._id !== customerId)
    }

    onSubmit() {
        if (this.customers.length === 0) {
            this.navigationService.showMessage('Agrega un cliente')
            return
        }
        if (this.formGroup.valid) {
            const customersId = this.customers.map(e => e._id)
            this.isLoading = true
            this.navigationService.loadBarStart()
            if (this.receptionId) {
                this.receptionsService.update(this.formGroup.value, customersId, this.receptionId).subscribe({
                    next: () => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Se han guardado los cambios')
                        if (this.reception) {
                            Object.assign(this.reception, this.formGroup.value)
                            this.receptionsService.setCustomers(this.customers)
                        }
                    }, error: (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
            } else {
                this.receptionsService.create(this.formGroup.value, customersId, this.roomId).subscribe({
                    next: reception => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Se han guardado los cambios')
                        this.reception = reception
                        this.receptionId = reception._id
                        this.receptionsService.setReception(reception)
                        this.receptionsService.setCustomers(this.customers)
                    }, error: (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
            }
        }
    }

}
