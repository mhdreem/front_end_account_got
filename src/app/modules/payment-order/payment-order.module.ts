import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentOrderRoutingModule } from './payment-order-routing.module';
import { PaymentOrderComponent } from './payment-order.component';


@NgModule({
  declarations: [
    PaymentOrderComponent
  ],
  imports: [
    CommonModule,
    PaymentOrderRoutingModule
  ]
})
export class PaymentOrderModule { }
