import { Component, OnDestroy, OnInit, AfterViewInit, OnChanges, ViewChild, Input, SimpleChanges } from "@angular/core";
import { Subscription, Observable, of, forkJoin } from "rxjs";
import { receipt_order } from "src/app/modules/shared/models/receipt_order";
import { result } from "src/app/modules/shared/models/result";
import { ReceiptOrderEditComponent } from "../receipt-order-edit/receipt-order-edit.component";
import { PageReceiptOrderService } from "../../pageservice/page-receipt-order.service";

import { ReceiptOrderService } from "src/app/modules/shared/services/receipt-order.service";

@Component({
  selector: 'app-receipt-order-entry',
  templateUrl: './receipt-order-entry.component.html',
  styleUrls: ['./receipt-order-entry.component.scss'],
})
export class ReceiptOrderEntryComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {
  @ViewChild(ReceiptOrderEditComponent) ExchangeOrder: ReceiptOrderEditComponent;

  public defaultNavActiveId: number | undefined = 1;
  _receipt_order: receipt_order;
  get receipt_order(): receipt_order {
    return this._receipt_order;
  }

  @Input() set receipt_order(obj: receipt_order) {
    this._receipt_order = {};
    this._receipt_order = obj;

    if (this._receipt_order == null)
      this._receipt_order = {};

    if (this._receipt_order.receipt_order_attachements == null ||
      this._receipt_order.receipt_order_attachements.length == 0)
      this._receipt_order.receipt_order_attachements = [];

    if (this._receipt_order == null ||
      this._receipt_order.receipt_order_details == null ||
      this._receipt_order.receipt_order_details.length == 0)
      this._receipt_order.receipt_order_details = [];

    if (this._receipt_order == null ||
      this._receipt_order.receipt_order_entries == null ||
      this._receipt_order.receipt_order_entries.length == 0)
      this._receipt_order.receipt_order_entries = [];



    if (this._receipt_order != null &&
      this._receipt_order.receipt_order_seq != null) {
      this.operation_code_fk = this._receipt_order.receipt_order_seq;
      this.seq = this._receipt_order.receipt_order_seq;
    }





  }




  operation_code_fk?: number = undefined;
  operation_type_fk?: number = 1;
  seq?: number = undefined;


  _Subscription: Subscription[] = [];

  constructor(
    private PageReceiptOrderService: PageReceiptOrderService,
    private ReceiptOrderService: ReceiptOrderService,
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
    
    this.PageReceiptOrderService.receipt_order ={
      receipt_order_details :[],
      receipt_order_attachements:[]
    };    
    this.PageReceiptOrderService.$receipt_order.next(this.PageReceiptOrderService.receipt_order); 
    this.receipt_order = this.PageReceiptOrderService.receipt_order;
  }

  public Load_receipt_order(receipt_order_seq: number | number | undefined): Observable<result> {

    if (receipt_order_seq == null ||
      receipt_order_seq == undefined ||
      receipt_order_seq == 0) {
      this.receipt_order = {};
      this.receipt_order.receipt_order_details = [];
      this.receipt_order.receipt_order_attachements = [];


      let result: result = {
        value: this.receipt_order,
        error: '',
        success: true
      }
      return of(result);
    }

    return this.ReceiptOrderService.getBySeq(receipt_order_seq);
  }





  loadData() {


    let receipt_order_seq: number | undefined | null = this.PageReceiptOrderService.receipt_order.receipt_order_seq;

    this._Subscription.push
      (
        forkJoin(
          this.Load_receipt_order(receipt_order_seq),

        ).subscribe(
          res => {
            if (res != null && res[0].value != null) {
              this.receipt_order = res[0].value;
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


  OnSelectItem(receipt_order: receipt_order) {
    this.receipt_order= JSON.parse(JSON.stringify(receipt_order));

  }





  re_load_data(receipt_order: receipt_order) {

    if (receipt_order == null)
      return;
    if (receipt_order.receipt_order_seq == null)
      return;





    if (receipt_order != null) {
      this.receipt_order =receipt_order; 
      this.operation_type_fk = 3;
      this.operation_code_fk = this.receipt_order.receipt_order_seq;
      this.seq = this.receipt_order.receipt_order_seq;

    }






  }



}
