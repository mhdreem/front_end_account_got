import { NgModule , OnInit} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { PaymentOrderEditComponent } from './components/payment-order-edit/payment-order-edit.component';
import { PaymentOrderListComponent } from './components/payment-order-list/payment-order-list.component';
import { PaymentOrderComponent } from './payment-order.component';

const routes: Routes = [
  {
    path: 'module',
    component: PaymentOrderComponent,
    data:
      {
        title: 'أوامر الدفع'
      },
      children:[
        {
          path: 'paymentOrder', component: PaymentOrderListComponent,
          data:
          {
            title: 'عرض أوامر الدفع'
          }
        },
        {
          path: 'paymentOrderEdit', component: PaymentOrderEditComponent,
          data:
          {
            title: 'تعديل أمر الدفع'
          }
        },
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentOrderRoutingModule {
  
 }
