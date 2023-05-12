import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { payment_order } from 'src/app/modules/shared/models/payment_order';

@Component({
  selector: 'app-payment-order-entries-view',
  templateUrl: './payment-order-entries-view.component.html',
  styleUrls: ['./payment-order-entries-view.component.scss']
})
export class PaymentOrderEntriesViewComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: payment_order,
  private dialogRef: MatDialogRef<PaymentOrderEntriesViewComponent>){

  }
}
