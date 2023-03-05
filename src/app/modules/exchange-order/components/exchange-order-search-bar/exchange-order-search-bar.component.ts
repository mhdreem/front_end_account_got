import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { exchange_order } from 'src/app/modules/shared/models/exchange_order';
import { ExchangeOrderService } from 'src/app/modules/shared/services/exchange-order.service';
import { PageExchangeOrderService } from '../../pageservice/page-exchange-order.service';

@Component({
  selector: 'app-exchange-order-search-bar',
  templateUrl: './exchange-order-search-bar.component.html',
  styleUrls: ['./exchange-order-search-bar.component.scss']
})
export class ExchangeOrderSearchBarComponent {
  Selected_Exchange_order: exchange_order;


  from_number: FormControl<number|null> ;
  to_number:  FormControl<number|null> ;
  sanad_month:  FormControl<number|null> ;
  incumbent_month:  FormControl<number|null> ;
  page_index:  FormControl<number|null> ;
  
  exchange_order_list: exchange_order[]= [];
  
  from_num_is_inserted: boolean= false;
  to_num_is_inserted: boolean= false;
  
  Form:FormGroup;
  
  darkTheme: boolean;
  
  constructor(
    private fb: FormBuilder,
    private pageService:PageExchangeOrderService,
    public dialog: MatDialog,
    private exchangeOrderService: ExchangeOrderService,
    @Inject(DOCUMENT) private _document: Document) {
      this.Form =this.fb.group({
        
      'incumbent_id_from':this.from_number = new  FormControl<number|null>(null) ,
      'incumbent_id_to':this.to_number=new  FormControl<number|null> (null),
      'month_incumbent':this.sanad_month= new  FormControl<number|null> (null),
      'month_document':this.incumbent_month=new  FormControl<number|null> (null),
      'page_index':this.page_index=new  FormControl<number|null> (1),
      });
  
     
     }
  
  
  ngOnInit(): void {
    
  }
  
  PerformSearch()
  {
    this.exchange_order_list=[];
    this.page_index.setValue(1);  
    this.RefreshList();
  }
  
  RefreshList()
  {    
    console.log('this.Form.value', this.Form.value);
    this.exchangeOrderService.search(this.Form.value).subscribe((res: any) =>{  
      console.log('res', res);
      this.exchange_order_list=[...this.exchange_order_list ,... res.value] ;
      console.log('this.exchange_order_list', this.exchange_order_list);
    });
  
  }
  
  
  SelectItemChange (Selected_Exchange_order: exchange_order)
  {
    this.Selected_Exchange_order = Selected_Exchange_order;
    this.pageService.$exchange_order.next(this.Selected_Exchange_order);
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
}
