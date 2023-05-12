import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { exchange_order } from 'src/app/modules/shared/models/exchange_order';

@Component({
  selector: 'app-exchange-order-entries-view',
  templateUrl: './exchange-order-entries-view.component.html',
  styleUrls: ['./exchange-order-entries-view.component.scss']
})
export class ExchangeOrderEntriesViewComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: exchange_order,
  private dialogRef: MatDialogRef<ExchangeOrderEntriesViewComponent>){

  }
}
