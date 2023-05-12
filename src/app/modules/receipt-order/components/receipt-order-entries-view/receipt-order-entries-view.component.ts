import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { receipt_order } from 'src/app/modules/shared/models/receipt_order';

@Component({
  selector: 'app-receipt-order-entries-view',
  templateUrl: './receipt-order-entries-view.component.html',
  styleUrls: ['./receipt-order-entries-view.component.scss']
})
export class ReceiptOrderEntriesViewComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: receipt_order,
  private dialogRef: MatDialogRef<ReceiptOrderEntriesViewComponent>){

  }
}
