import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { CreateEventItemModel } from '../create-event-item.model';
import { CreateEventModel } from '../create-event.model';
import { EventsService } from '../events.service';
import { SpecialtyModel } from '../specialty.model';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { MaterialModule } from '../../material.module';
import { EventItemsComponent } from '../event-items/event-items.component';

interface FormData {
    hours: any,
    minutes: any,
    ampm: string,
    scheduledAt: any,
    workerId: any,
    specialtyId: any,
    referredId: any,
    observations: string,
}

@Component({
    selector: 'app-edit-events',
    imports: [MaterialModule, ReactiveFormsModule, EventItemsComponent, CommonModule],
    templateUrl: './edit-events.component.html',
    styleUrls: ['./edit-events.component.sass'],
})
export class EditEventsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly workersService: WorkersService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly eventsService: EventsService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
        private readonly location: Location,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        hours: [8, [Validators.required, Validators.min(0), Validators.max(12)]],
        minutes: [0, [Validators.required, Validators.min(0), Validators.max(60)]],
        ampm: 'AM',
        scheduledAt: ['', Validators.required],
        workerId: [null, Validators.required],
        referredId: [null, Validators.required],
        specialtyId: [null, Validators.required],
        observations: '',
    } as FormData)
    eventItems: CreateEventItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    cash: number = 0
    workers: WorkerModel[] = []
    specialties: SpecialtyModel[] = []
    addresses: string[] = []
    private eventId: string | null = null
    private setting: SettingModel = new SettingModel()

    minutes: any[] = [
        { value: 0, label: '00' },
        { value: 15, label: '15' },
        { value: 30, label: '30' },
        { value: 45, label: '45' },
    ]

    hours: any[] = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' },
        { value: 8, label: '8' },
        { value: 9, label: '9' },
        { value: 10, label: '10' },
        { value: 11, label: '11' },
        { value: 12, label: '12' },
    ]

    private handleClickMenu$: Subscription = new Subscription()
    private handleEventItems$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()
    private handleSpecialties$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleEventItems$.unsubscribe()
        this.handleSpecialties$.unsubscribe()
        this.handleWorkers$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {

        this.navigationService.setTitle('Agendar')

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
        })

        this.handleSpecialties$ = this.specialtiesService.handleSpecialties().subscribe(specialties => {
            this.specialties = specialties
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.navigationService.setMenu([
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_customer':
                    const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.setting.defaultSearchCustomer
                    })

                    dialogRef.afterClosed().subscribe(customer => {
                        if (customer) {
                            this.customer = customer
                        }
                    })

                    dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(customer => {
                            if (customer) {
                                this.customer = customer
                            }
                        })
                    })
                    break
                default:
                    break
            }
        })

        this.handleEventItems$ = this.eventsService.handleEventItems().subscribe(eventItems => {
            this.eventItems = eventItems
            this.charge = 0
            for (const eventItem of this.eventItems) {
                if (eventItem.igvCode !== '11') {
                    this.charge += eventItem.price * eventItem.quantity
                }
            }
        })

        const event = this.eventsService.getEvent()

        if (event == null) {
            this.location.back()
        } else {
            const { customer } = event
            this.customer = customer
            this.eventId = event._id
            const date = new Date(event.scheduledAt)
            const hours = date.getHours()
            const minutes = date.getMinutes()
            this.formGroup.get('scheduledAt')?.patchValue(date)
            if (hours < 13) {
                this.formGroup.get('hours')?.patchValue(hours)
                this.formGroup.get('ampm')?.patchValue('AM')
            } else {
                this.formGroup.get('hours')?.patchValue(hours - 12)
                this.formGroup.get('ampm')?.patchValue('PM')
            }
            this.formGroup.get('minutes')?.patchValue(minutes)
            this.formGroup.get('workerId')?.patchValue(event.workerId)
            this.formGroup.get('specialtyId')?.patchValue(event.specialtyId)
            this.formGroup.get('referredId')?.patchValue(event.referredId)
            this.formGroup.get('observations')?.patchValue(event.observations)
        }
    }

    onSubmit() {
        try {
            if (this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (this.eventItems.length === 0) {
                throw new Error("Agrega un producto")
            }

            if (this.eventItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            if (this.formGroup.valid) {
                this.isLoading = true
                this.navigationService.loadBarStart()

                const formData: FormData = this.formGroup.value

                const event: CreateEventModel = {
                    scheduledAt: formData.scheduledAt,
                    workerId: formData.workerId,
                    specialtyId: formData.specialtyId,
                    referredId: formData.referredId,
                    observations: formData.observations,
                    customerId: this.customer._id,
                }

                const { hours, minutes, ampm } = this.formGroup.value

                if (ampm === 'AM') {
                    event.scheduledAt.setHours(hours)
                } else {
                    if ((hours + 12) >= 24) {
                        throw new Error('Formato de hora ilegal')
                    }
                    event.scheduledAt.setHours(hours + 12)
                }
                event.scheduledAt.setMinutes(minutes)

                this.eventsService.updateEvent(event, this.eventItems, this.eventId || '').subscribe(() => {
                    this.eventsService.setEventItems([])
                    this.router.navigate(['/events'])
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                })
            }

        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.isLoading = false
            this.navigationService.loadBarFinish()
        }
    }

    onEditCustomer() {
        const dialogRef = this.matDialog.open(DialogEditCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.customer,
        })

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.customer = customer
                this.addresses = customer.addresses
            }
        })
    }

}
