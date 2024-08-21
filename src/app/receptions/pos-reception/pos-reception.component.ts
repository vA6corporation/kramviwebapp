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
import { CommonModule } from '@angular/common';
import { DialogCreateReservationData, DialogCreateReservationsComponent } from '../../reservations/dialog-create-reservations/dialog-create-reservations.component';
import { ReservationsService } from '../../reservations/reservations.service';
import { SalesService } from '../../sales/sales.service';

@Component({
    selector: 'app-pos-reception',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './pos-reception.component.html',
    styleUrls: ['./pos-reception.component.sass']
})
export class PosReceptionComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly reservationsService: ReservationsService,
        private readonly receptionsService: ReceptionsService,
        private readonly salesService: SalesService,
        private readonly roomsService: RoomsService,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
    ) { }

    reservations: any[] = []
    room: RoomModel | null = null
    reception: ReceptionModel | null = null
    customer: CustomerModel | null = null
    customers: CustomerModel[] = []
    formGroup: FormGroup = this.formBuilder.group({
        hours: [24, Validators.required],
        charge: [0, Validators.required],
        observations: '',
    })
    checkinTime = new Date()
    checkoutTime = new Date()
    receptionId: string = ''
    saleId: string | null = null
    isLoading: boolean = true
    private roomId: string = ''

    ngOnInit(): void {
        const { hours } = this.formGroup.value
        this.checkoutTime = new Date(this.checkoutTime.setTime(this.checkoutTime.getTime() + (hours * 60 * 60 * 1000)))
        this.roomId = this.activatedRoute.snapshot.params['roomId']
        this.navigationService.loadBarStart()
        this.reservationsService.getReservationsByRoom(this.roomId).subscribe(reservations => {
            this.reservations = reservations
        })
        this.salesService.setSaleItems([])
        this.roomsService.getRoomById(this.roomId).subscribe({
            next: room => {
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.room = room
                this.reception = room.reception
                if (this.reception) {
                    this.room.price = this.reception.charge
                }
                this.receptionsService.setRoom(this.room)

                if (this.reception) {
                    this.customers = this.reception.customers
                    this.receptionId = this.reception._id
                    this.saleId = this.reception.saleId
                    this.formGroup.patchValue(this.reception)
                    this.receptionsService.setReception(this.reception)
                    this.receptionsService.setCustomers(this.reception.customers)
                } else {
                    this.formGroup.patchValue({ charge: this.room.price })
                }
                this.navigationService.setTitle(`Habitacion N° ${room.roomNumber}`)
            }, error: (error: HttpErrorResponse) => {
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    changePrice() {
        const { charge } = this.formGroup.value
        if (this.room) {
            this.room.price = (charge || 0)
        }
    }

    changeHours() {
        const { hours } = this.formGroup.value
        const startDate = new Date(this.checkinTime)
        this.checkoutTime = new Date(startDate.setTime(startDate.getTime() + ((hours || 1) * 60 * 60 * 1000)))
    }

    onCheckOut() {
        this.navigationService.loadBarStart()
        this.receptionsService.checkOut(this.receptionId).subscribe({
            next: () => {
                this.navigationService.loadBarFinish()
                this.router.navigate(['/receptions'])
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onCleaned() {
        this.navigationService.loadBarStart()
        this.receptionsService.cleaned(this.receptionId).subscribe({
            next: () => {
                this.navigationService.loadBarFinish()
                this.router.navigate(['/receptions'])
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    createReservation(customer: CustomerModel) {
        if (this.room) {
            const data: DialogCreateReservationData = {
                customer,
                room: this.room
            }

            const dialogRef = this.matDialog.open(DialogCreateReservationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data
            })

            dialogRef.afterClosed().subscribe(reservation => {
                if (reservation) {
                    this.navigationService.loadBarStart()
                    this.reservationsService.create(reservation).subscribe({
                        next: reservation => {
                            this.navigationService.loadBarFinish()
                            this.reservations.push(reservation)
                        }, error: (error: HttpErrorResponse) => {
                            this.navigationService.showMessage(error.error.message)
                            this.navigationService.loadBarFinish()
                        }
                    })
                }
            })
        }
    }

    onCreateReservation() {
        const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: 'DNI'
        })

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.createReservation(customer)
            }
        })

        dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
            const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(customer => {
                if (customer) {
                    this.createReservation(customer)
                }
            })
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

    onDeleteReservation(reservationId: string) {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.reservationsService.delete(reservationId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.reservations = this.reservations.filter(e => e._id !== reservationId)
            })
        }
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
