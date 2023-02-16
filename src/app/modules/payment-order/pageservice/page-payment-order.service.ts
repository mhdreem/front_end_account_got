import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { payment_order } from '../../shared/models/payment_order';

@Injectable({
  providedIn: 'root'
})
export class PagePaymentOrderService {

  public payment_order : payment_order;
  public $payment_order : BehaviorSubject<payment_order> ;
 

  
  constructor() { 
    this.payment_order = {};
    this.payment_order.payment_order_details=[];
    this.payment_order.payment_order_attachements=[];
    this.payment_order.payment_order_entries=[];
    this.$payment_order  = new  BehaviorSubject<payment_order>({});
  }

  new()
  {
    this.payment_order = {};
    this.payment_order.payment_order_details=[];
    this.payment_order.payment_order_attachements=[];
    this.payment_order.payment_order_entries=[];
    this.$payment_order.next(this.payment_order);
  } 

  set(payment_order:payment_order)
  {
    this.payment_order = payment_order;
    this.$payment_order.next( this.payment_order);
  } 
}
