import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptOrderEditComponent } from './components/receipt-order-edit/receipt-order-edit.component';
import { ReceiptOrderListComponent } from './components/receipt-order-list/receipt-order-list.component';
import { ReceiptOrderComponent } from './receipt-order.component';
import { ReceiptOrderEntryComponent } from './components/receipt-order-entry/receipt-order-entry.component';

const routes: Routes = [

  {
    path: 'list', component: ReceiptOrderListComponent,
    data:
    {
      title: 'عرض أوامر القبض'
    }
  },
  {
    path: 'edit', component: ReceiptOrderEntryComponent,
    data:
    {
      title: 'تعديل أمر القبض'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptOrderRoutingModule { }
