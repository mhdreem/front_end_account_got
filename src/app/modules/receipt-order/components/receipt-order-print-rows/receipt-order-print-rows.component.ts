import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-receipt-order-print-rows',
  templateUrl: './receipt-order-print-rows.component.html',
  styleUrls: ['./receipt-order-print-rows.component.scss']
})
export class ReceiptOrderPrintRowsComponent {
  @Input() documents: any[]= [];
   document_type: string= "أمر قبض";

  documents_total_value: number= 0;
  today_date: Date= new Date();

  ngOnChanges(){
    this.documents_total_value= 0;

    this.documents.forEach(document =>{
      this.documents_total_value += document.total_value;
    });
  }
}
