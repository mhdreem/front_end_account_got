import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exchange-order-print-rows',
  templateUrl: './exchange-order-print-rows.component.html',
  styleUrls: ['./exchange-order-print-rows.component.scss']
})
export class ExchangeOrderPrintRowsComponent {
  @Input() documents: any[]= [];
  document_type: string= "أمر صرف";

 documents_total_value: number= 0;
 today_date: Date= new Date();

 ngOnChanges(){
   this.documents_total_value= 0;

   this.documents.forEach(document =>{
     this.documents_total_value += document.total_value;
   });
 }
}
