import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { exchange_order } from '../../shared/models/exchange_order';

@Injectable({
  providedIn: 'root'
})
export class PageExchangeOrderService {

  public exchange_order : exchange_order;
  public $exchange_order : BehaviorSubject<exchange_order> ;
 

  
  constructor() { 
    this.exchange_order = {};
    this.exchange_order.exchange_order_details=[];
    this.exchange_order.exchange_order_attachements=[];
    this.exchange_order.exchange_order_entries=[];
    this.$exchange_order  = new  BehaviorSubject<exchange_order>({});
  }

  new()
  {
    this.exchange_order = {};
    this.exchange_order.exchange_order_details=[];
    this.exchange_order.exchange_order_attachements=[];
    this.exchange_order.exchange_order_entries=[];
    this.$exchange_order.next(this.exchange_order);
  } 

  set(exchange_order:exchange_order)
  {
    this.exchange_order = exchange_order;
    this.$exchange_order.next( this.exchange_order);
  } 
}
