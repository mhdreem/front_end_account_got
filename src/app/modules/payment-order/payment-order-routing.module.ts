import { NgModule , OnInit} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { PaymentOrderComponent } from './payment-order.component';

const routes: Routes = [{ path: '', component: PaymentOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentOrderRoutingModule {
  
 }
