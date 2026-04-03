import { Routes } from '@angular/router'
import { ChargeComponent } from './charge/charge.component'
import { ChargeFoodComponent } from './charge-food/charge-food.component'
import { ChargeCreditComponent } from './charge-credit/charge-credit.component'
import { ChargeEditComponent } from './charge-edit/charge-edit.component'
import { CopySalesComponent } from './copy-sales/copy-sales.component'
import { ChargeFromComponent } from './charge-from/charge-from.component'
import { ChargeBoardsComponent } from './charge-boards/charge-boards.component'
import { DetailSaleItemsComponent } from './detail-sale-items/detail-sale-items.component'
import { SalesComponent } from './sales/sales.component'

export const routes: Routes = [
    { path: '', component: SalesComponent },
    { path: 'charge', component: ChargeComponent },
    { path: 'chargeFood', component: ChargeFoodComponent },
    { path: 'chargeBoards', component: ChargeBoardsComponent },
    { path: 'chargeCredit', component: ChargeCreditComponent },
    { path: ':saleId/edit', component: ChargeEditComponent },
    { path: 'copy/:saleId', component: CopySalesComponent },
    { path: 'from', component: ChargeFromComponent },
    { path: ':productId/saleItems', component: DetailSaleItemsComponent }
]
