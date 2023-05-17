import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { exchange_order } from 'src/app/modules/shared/models/exchange_order';
import { ExchangeOrderEditComponent } from '../exchange-order-edit/exchange-order-edit.component';
import { PageExchangeOrderService } from '../../pageservice/page-exchange-order.service';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { result } from 'src/app/modules/shared/models/result';
import { ExchangeOrderService } from 'src/app/modules/shared/services/exchange-order.service';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';

@Component({
  selector: 'app-exchange-order-entry',
  templateUrl: './exchange-order-entry.component.html',
  styleUrls: ['./exchange-order-entry.component.scss'],
})
export class ExchangeOrderEntryComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {
  @ViewChild(ExchangeOrderEditComponent) ExchangeOrder: ExchangeOrderEditComponent;

  public defaultNavActiveId: number | undefined = 1;
  _exchange_order: exchange_order;
  get exchange_order(): exchange_order {
    return this._exchange_order;
  }

  @Input() set exchange_order(obj: exchange_order) {
    this._exchange_order = {};
    this._exchange_order = obj;

    if (this._exchange_order == null)
      this._exchange_order = {};

    if (this._exchange_order.exchange_order_attachements == null ||
      this._exchange_order.exchange_order_attachements.length == 0)
      this._exchange_order.exchange_order_attachements = [];

    if (this._exchange_order == null ||
      this._exchange_order.exchange_order_details == null ||
      this._exchange_order.exchange_order_details.length == 0)
      this._exchange_order.exchange_order_details = [];

    if (this._exchange_order == null ||
      this._exchange_order.exchange_order_entries == null ||
      this._exchange_order.exchange_order_entries.length == 0)
      this._exchange_order.exchange_order_entries = [];



    if (this._exchange_order != null &&
      this._exchange_order.exchange_order_seq != null) {
      this.operation_code_fk = this._exchange_order.exchange_order_seq;
      this.seq = this._exchange_order.exchange_order_seq;
    }





  }




  operation_code_fk?: number = undefined;
  operation_type_fk?: number = 1;
  seq?: number = undefined;


  _Subscription: Subscription[] = [];

  constructor(
    private PageExchangeOrderService: PageExchangeOrderService,
    private ExchangeOrderService: ExchangeOrderService,
  ) {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
   
  }

  ngOnDestroy(): void {

    this._Subscription.forEach(Sub => {
      if (Sub != null) Sub.unsubscribe();
    });
  }


  new_record()
  {
    
    this.PageExchangeOrderService.exchange_order ={
      exchange_order_details :[],
      exchange_order_attachements:[]
    };    
    this.PageExchangeOrderService.$exchange_order.next(this.PageExchangeOrderService.exchange_order); 
    this.exchange_order = this.PageExchangeOrderService.exchange_order;
  }

  public Load_exchange_order(exchange_order_seq: number | number | undefined): Observable<result> {

    if (exchange_order_seq == null ||
      exchange_order_seq == undefined ||
      exchange_order_seq == 0) {
      this.exchange_order = {};
      this.exchange_order.exchange_order_details = [];
      this.exchange_order.exchange_order_attachements = [];


      let result: result = {
        value: this.exchange_order,
        error: '',
        success: true
      }
      return of(result);
    }

    return this.ExchangeOrderService.getBySeq(exchange_order_seq);
  }





  loadData() {


    let exchange_order_seq: number | undefined | null = this.PageExchangeOrderService.exchange_order.exchange_order_seq;

    this._Subscription.push
      (
        forkJoin(
          this.Load_exchange_order(exchange_order_seq),

        ).subscribe(
          res => {
            if (res != null && res[0].value != null) {
              this.exchange_order = res[0].value;
            }

          }
        )
      );
  }




  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  save_as_draft() {

    if (this.ExchangeOrder != null) {
      this.ExchangeOrder.save_as_draft();
    }

  }


  save() {

    if (this.ExchangeOrder != null) {
      this.ExchangeOrder.save();
    }


  }


  OnSelectItem(exchange_order: exchange_order) {
    this.exchange_order= JSON.parse(JSON.stringify(exchange_order));
  }





  re_load_data(exchange_order: exchange_order) {

    if (exchange_order == null)
      return;
    if (exchange_order.exchange_order_seq == null)
      return;





    if (exchange_order != null) {

      this.operation_code_fk = this.exchange_order.exchange_order_seq;
      this.seq = this.exchange_order.exchange_order_seq;

    }






  }



}
