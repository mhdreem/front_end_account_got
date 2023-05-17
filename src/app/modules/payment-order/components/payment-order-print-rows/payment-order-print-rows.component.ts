import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-order-print-rows',
  templateUrl: './payment-order-print-rows.component.html',
  styleUrls: ['./payment-order-print-rows.component.scss']
})
export class PaymentOrderPrintRowsComponent {
  @Input() documents: any[]= [];
  document_type: string= "أمر دفع";

 documents_total_value: number= 0;
 today_date: Date= new Date();

 ngOnChanges(){
   this.documents_total_value= 0;

   this.documents.forEach(document =>{
     this.documents_total_value += document.total_value;
   });
 }
}
