import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { payment_order } from 'src/app/modules/shared/models/payment_order';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { result } from 'src/app/modules/shared/models/result';

import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';
import { PagePaymentOrderService } from '../../pageservice/page-payment-order.service';
import { PaymentOrderEditComponent } from '../payment-order-edit/payment-order-edit.component';
import { PaymentOrderService } from 'src/app/modules/shared/services/payment-order.service';


@Component({
  selector: 'app-payment-order-entry',
  templateUrl: './payment-order-entry.component.html',
  styleUrls: ['./payment-order-entry.component.scss'],
})
export class PaymentOrderEntryComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {
  @ViewChild(PaymentOrderEditComponent) PaymentOrder: PaymentOrderEditComponent;

  public defaultNavActiveId: number | undefined = 1;
  _payment_order: payment_order;
  get payment_order(): payment_order {
    return this._payment_order;
  }

  @Input() set payment_order(obj: payment_order) {
    this._payment_order = {};
    this._payment_order = obj;

    if (this._payment_order == null)
      this._payment_order = {};

    if (this._payment_order.payment_order_attachements == null ||
      this._payment_order.payment_order_attachements.length == 0)
      this._payment_order.payment_order_attachements = [];

    if (this._payment_order == null ||
      this._payment_order.payment_order_details == null ||
      this._payment_order.payment_order_details.length == 0)
      this._payment_order.payment_order_details = [];

    if (this._payment_order == null ||
      this._payment_order.payment_order_entries == null ||
      this._payment_order.payment_order_entries.length == 0)
      this._payment_order.payment_order_entries = [];



    if (this._payment_order != null &&
      this._payment_order.payment_order_seq != null) {
      this.operation_code_fk = this._payment_order.payment_order_seq;
      this.seq = this._payment_order.payment_order_seq;
    }





  }




  operation_code_fk?: number = undefined;
  operation_type_fk?: number = 1;
  seq?: number = undefined;


  _Subscription: Subscription[] = [];

  constructor(
    private PagePaymentOrderService: PagePaymentOrderService,
    private PaymentOrderService: PaymentOrderService,
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
    
    this.PagePaymentOrderService.payment_order ={
      payment_order_details :[],
      payment_order_attachements:[]
    };    
    this.PagePaymentOrderService.$payment_order.next(this.PagePaymentOrderService.payment_order); 
    this.payment_order = this.PagePaymentOrderService.payment_order;
  }

  public Load_payment_order(payment_order_seq: number | number | undefined): Observable<result> {

    if (payment_order_seq == null ||
      payment_order_seq == undefined ||
      payment_order_seq == 0) {
      this.payment_order = {};
      this.payment_order.payment_order_details = [];
      this.payment_order.payment_order_attachements = [];


      let result: result = {
        value: this.payment_order,
        error: '',
        success: true
      }
      return of(result);
    }

    return this.PaymentOrderService.getBySeq(payment_order_seq);
  }





  loadData() {


    let payment_order_seq: number | undefined | null = this.PagePaymentOrderService.payment_order.payment_order_seq;

    this._Subscription.push
      (
        forkJoin(
          this.Load_payment_order(payment_order_seq),

        ).subscribe(
          res => {
            if (res != null && res[0].value != null) {
              this.payment_order = res[0].value;
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

    if (this.PaymentOrder != null) {
      this.PaymentOrder.save_as_draft();
    }

  }


  save() {

    if (this.PaymentOrder != null) {
      this.PaymentOrder.save();
    }


  }


  OnSelectItem(payment_order: payment_order) {
    this.PaymentOrder= JSON.parse(JSON.stringify(payment_order));

  }





  re_load_data(payment_order: payment_order) {

    if (payment_order == null)
      return;
    if (payment_order.payment_order_seq == null)
      return;





    if (payment_order != null) {

      this.operation_code_fk = this.payment_order.payment_order_seq;
      this.seq = this.payment_order.payment_order_seq;

    }






  }



}
