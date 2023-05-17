import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sanad-kid-print-rows',
  templateUrl: './sanad-kid-print-rows.component.html',
  styleUrls: ['./sanad-kid-print-rows.component.scss']
})
export class SanadKidPrintRowsComponent {
  @Input() documents: any[]= [];
  document_type: string= "سند قيد";

  documents_total_value: number= 0;
  today_date: Date= new Date();

  ngOnChanges(){
    this.documents_total_value= 0;

    this.documents.forEach(document =>{
      this.documents_total_value += document.sanad_total_value;
    });
  }
}
