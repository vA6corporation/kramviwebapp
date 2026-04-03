import { Routes } from '@angular/router'
import { ChargeEditProformasComponent } from './charge-edit-proformas/charge-edit-proformas.component'
import { ChargeProformasComponent } from './charge-proformas/charge-proformas.component'
import { CopyProformasComponent } from './copy-proformas/copy-proformas.component'
import { PosProformasComponent } from './pos-proformas/pos-proformas.component'
import { EditProformasComponent } from './edit-proformas/edit-proformas.component'
import { ProformasComponent } from './proformas/proformas.component'

export const routes: Routes = [
    { path: '', component: ProformasComponent },
    { path: 'posProformas', component: PosProformasComponent },
    { path: ':proformaId/edit', component: EditProformasComponent },
    { path: 'charge', component: ChargeProformasComponent },
    { path: 'chargeEdit', component: ChargeEditProformasComponent },
    { path: 'copy/:proformaId', component: CopyProformasComponent }
]
