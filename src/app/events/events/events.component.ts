import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { DialogDateEventsComponent } from '../dialog-date-events/dialog-date-events.component';
import { EventModel } from '../event.model';
import { EventsService } from '../events.service';
import { SpecialtyModel } from '../specialty.model';
import { IgvType } from '../../products/igv-type.enum';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.sass']
})
export class EventsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly eventsService: EventsService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
        private readonly specialtiesService: SpecialtiesService,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        date: new Date(),
        specialtyId: '',
    })
    events: EventModel[] = []
    filterEvents: EventModel[] = []
    specialties: SpecialtyModel[] = []
    filterSpecialties: SpecialtyModel[] = []
    igvType = IgvType

    private handleSpecialties$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSpecialties$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Agenda')

        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        const { date } = this.activatedRoute.snapshot.queryParams
        if (date) {
            this.formGroup.patchValue({ date: new Date(Number(date)) })
        }
        this.fetchData()

        this.handleSpecialties$ = this.specialtiesService.handleSpecialties().subscribe(specialties => {
            this.specialties = specialties
        })
    }

    fetchData() {
        const { date, specialtyId } = this.formGroup.value
        this.navigationService.loadBarStart()
        this.eventsService.getEvents(date).subscribe(events => {
            this.navigationService.loadBarFinish()
            this.events = events
            if (specialtyId) {
                this.filterEvents = this.events.filter(e => e.specialtyId === specialtyId)
            } else {
                this.filterEvents = this.events
            }
            this.filterSpecialties = this.specialties.filter(e => this.countEvents(e._id))
        })
    }

    onChangeSpecialty() {
        const { specialtyId } = this.formGroup.value
        if (specialtyId) {
            this.filterEvents = this.events.filter(e => e.specialtyId === specialtyId)
        } else {
            this.filterEvents = this.events
        }
    }

    onChangeEventDate(event: EventModel) {
        const dialogRef = this.matDialog.open(DialogDateEventsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: event,
        })

        dialogRef.afterClosed().subscribe((ok) => {
            if (ok) {
                this.fetchData()
            }
        })
    }

    countEvents(specialtyId: string): number {
        return this.events.filter(e => e.specialtyId === specialtyId).length
    }

    onOpenDetails(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onDateChange() {
        this.formGroup.patchValue({ specialtyId: '' })
        const { date } = this.formGroup.value
        const queryParams: Params = { date: new Date(date).getTime() }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
    }

    onDeleteEvent(eventId: string) {
        const ok = confirm('Esta seguro de aliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.eventsService.delete(eventId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
            })
        }
    }

    onExportEvent(event: EventModel) {
        this.printService.exportPdfEvent80mm(event)
    }

}
