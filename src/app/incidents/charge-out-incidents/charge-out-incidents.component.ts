import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { CreateIncidentItemModel } from '../create-incident-item.model';
import { CreateIncidentModel } from '../create-incident.model';
import { IncidentItemsComponent } from '../incident-items/incident-items.component';
import { IncidentsService } from '../incidents.service';

@Component({
    selector: 'app-charge-out-incidents',
    imports: [MaterialModule, ReactiveFormsModule, IncidentItemsComponent],
    templateUrl: './charge-out-incidents.component.html',
    styleUrl: './charge-out-incidents.component.sass'
})
export class ChargeOutIncidentsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly incidentsService: IncidentsService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        observations: '',
    })
    incidentItems: CreateIncidentItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false

    private handlePurchaseItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePurchaseItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Reducir stock')

        this.handlePurchaseItems$ = this.incidentsService.handleIncidentItems().subscribe(incidentItems => {
            this.incidentItems = incidentItems
            this.charge = 0
            for (const purchaseItem of this.incidentItems) {
                if (purchaseItem.igvCode !== '11') {
                    this.charge += purchaseItem.cost * purchaseItem.quantity
                }
            }
        })
    }

    onSubmit() {
        try {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const formData = this.formGroup.value
            const incident: CreateIncidentModel = {
                observations: formData.observations || '',
            }

            if (this.incidentItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            this.incidentsService.createOut(incident, this.incidentItems).subscribe({
                next: () => {
                    this.incidentsService.setIncidentItems([])
                    this.router.navigate(['/incidents'])
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.isLoading = false
            this.navigationService.loadBarFinish()
        }
    }

}
