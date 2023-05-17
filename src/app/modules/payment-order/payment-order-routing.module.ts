import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentOrderEditComponent } from './components/payment-order-edit/payment-order-edit.component';
import { PaymentOrderListComponent } from './components/payment-order-list/payment-order-list.component';
import { PaymentOrderEntryComponent } from './components/payment-order-entry/payment-order-entry.component';

const routes: Routes = [

  {
    path: 'list', component: PaymentOrderListComponent,
    data:
    {
      title: 'عرض أوامر الدفع'
    }
  },
  {
    path: 'edit', component: PaymentOrderEntryComponent,
    data:
    {
      title: 'تعديل أمر الدفع'
    }
  }


];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentOrderRoutingModule {

}
