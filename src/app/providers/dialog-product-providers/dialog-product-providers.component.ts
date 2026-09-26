import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { ProvidersService } from '../providers.service';
import { ProviderModel } from '../provider.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-product-providers',
    imports: [MaterialModule],
    templateUrl: './dialog-product-providers.component.html',
    styleUrl: './dialog-product-providers.component.sass'
})
export class DialogProductProvidersComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly providerIds: string[],
        private readonly providersService: ProvidersService,
    ) { }

    providers: ProviderModel[] = []

    ngOnInit() {
        this.providersService.getProvidersByProviderIds(this.providerIds).subscribe(providers => {
            this.providers = providers
        })
    }

}
