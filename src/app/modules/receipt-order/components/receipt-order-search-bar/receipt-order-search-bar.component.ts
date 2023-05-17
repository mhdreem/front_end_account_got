import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { month, months } from 'src/app/modules/shared/models/month';
import { receipt_order } from 'src/app/modules/shared/models/receipt_order';

import { ReceiptOrderService } from 'src/app/modules/shared/services/receipt-order.service';
import { PageReceiptOrderService } from '../../pageservice/page-receipt-order.service';

@Component({
  selector: 'app-receipt-order-search-bar',
  templateUrl: './receipt-order-search-bar.component.html',
  styleUrls: ['./receipt-order-search-bar.component.scss']
})
export class ReceiptOrderSearchBarComponent {

  @Input() Title:string = '';
  @Output() OnSelectItem : EventEmitter<any> = new EventEmitter<any>();


  Selected_receipt_order: receipt_order;

  months:month[]=months ;

  incumbent_id_from: FormControl<number|null> ;
  incumbent_id_to:  FormControl<number|null> ;

  document_id_from: FormControl<number|null> ;
  document_id_to:  FormControl<number|null> ;

  

  sanad_month:  FormControl<number[]|null> ;
  incumbent_month:  FormControl<number[]|null> ;
  page_index:  FormControl<number|null> ;
  
  receipt_order_list: receipt_order[]= [];
  
  from_num_is_inserted: boolean= false;
  to_num_is_inserted: boolean= false;
  
  Form:FormGroup;
  
  darkTheme: boolean;
  
  constructor(
    private modalService: NgbModal,  
    private fb: FormBuilder,
    private PageReceiptOrderService:PageReceiptOrderService,
    public dialog: MatDialog,
    private ReceiptOrderService: ReceiptOrderService,
    @Inject(DOCUMENT) private _document: Document) {

      console.log(this.months);
      this.Form =this.fb.group({        
      'incumbent_id_from':this.incumbent_id_from = new  FormControl<number|null>(null) ,
      'incumbent_id_to':this.incumbent_id_to=new  FormControl<number|null> (null),
      'document_id_from':this.document_id_from = new  FormControl<number|null>(null) ,
      'document_id_to':this.document_id_to=new  FormControl<number|null> (null),
      'month_incumbent':this.sanad_month= new  FormControl<number[]|null> (null),
      'month_document':this.incumbent_month=new  FormControl<number[]|null> (null),
      'page_index':this.page_index=new  FormControl<number|null> (1),
      });
  
     
     }
  
  
  ngOnInit(): void {
    
  }
  
  PerformSearch()
  {
    this.receipt_order_list=[];
    this.page_index.setValue(1);  
    this.RefreshList();
  }
  
  RefreshList()
  {    
    console.log('this.Form.value', this.Form.value);
    this.ReceiptOrderService.search(this.Form.value).subscribe((res: any) =>{  
      console.log('res', res);
      this.receipt_order_list=[...this.receipt_order_list ,... res.value] ;
      console.log('this.receipt_order_list', this.receipt_order_list);
    });
  
  }
  
  
  SelectItemChange (Selected_receipt_order: receipt_order)
  {
    this.Selected_receipt_order = Selected_receipt_order;
    this.PageReceiptOrderService.$receipt_order.next(this.Selected_receipt_order);
    this.OnSelectItem.emit(this.Selected_receipt_order);
   

  }
  
  
  
  
  
  
  onScroll() {
     this.page_index.setValue(this.page_index.value! + 1);
     this.Form.controls['page_index'] .setValue( this.page_index);
     this.RefreshList();
  }
  
  public ngOnDestroy (): void {
   
  }
  
  focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  
  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, { windowClass: 'sidepanel sidepanel-fade', size: 'side-40', backdropClass: 'light-blue-backdrop' }).result.then((Result) => {  

if (Result==1)
      {
        
      }
else 
{

}


    }).catch(() => {

    });
  }

}
