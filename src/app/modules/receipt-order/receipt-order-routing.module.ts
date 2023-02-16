import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptOrderEditComponent } from './components/receipt-order-edit/receipt-order-edit.component';
import { ReceiptOrderListComponent } from './components/receipt-order-list/receipt-order-list.component';
import { ReceiptOrderComponent } from './receipt-order.component';

const routes: Routes = [
  {
    path: 'module',
    component: ReceiptOrderComponent,
    data:
      {
        title: 'أوامر القبض'
      },
      children:[
        {
          path: 'receiptOrder', component: ReceiptOrderListComponent,
          data:
          {
            title: 'عرض أوامر القبض'
          }
        },
        {
          path: 'receiptOrderEdit', component: ReceiptOrderEditComponent,
          data:
          {
            title: 'تعديل أمر القبض'
          }
        },
      ]
    }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptOrderRoutingModule { }
