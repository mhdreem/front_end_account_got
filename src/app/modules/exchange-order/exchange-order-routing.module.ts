import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeOrderEditComponent } from './components/exchange-order-edit/exchange-order-edit.component';
import { ExchangeOrderListComponent } from './components/exchange-order-list/exchange-order-list.component';
import { ExchangeOrderComponent } from './exchange-order.component';

const routes: Routes = [
  {
    path: 'module',
    component: ExchangeOrderComponent,
    data:
      {
        title: 'أوامر الصرف'
      },
      children:[
        {
          path: 'exchangeOrder', component: ExchangeOrderListComponent,
          data:
          {
            title: 'عرض أوامر الصرف'
          }
        },
        {
          path: 'exchangeOrderEdit', component: ExchangeOrderEditComponent,
          data:
          {
            title: 'تعديل أمر الصرف'
          }
        },
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeOrderRoutingModule { }
