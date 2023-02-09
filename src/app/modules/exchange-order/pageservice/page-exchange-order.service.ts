import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExchangeOrder } from '../../shared/models/exchange-order';

@Injectable({
  providedIn: 'root'
})
export class PageExchangeOrderService {

  public exchange_order : ExchangeOrder;
  public $exchange_order : BehaviorSubject<ExchangeOrder> ;


  
  constructor() { 
    this.exchange_order = {};
    this.exchange_order.exchange_order_details=[];
    this.exchange_order.exchange_order_attachements=[];
    this.exchange_order.exchange_order_entries=[];
    this.$exchange_order  = new  BehaviorSubject<ExchangeOrder>({});
  }

  new()
  {
    this.exchange_order = {};
    this.exchange_order.exchange_order_details=[];
    this.exchange_order.exchange_order_attachements=[];
    this.exchange_order.exchange_order_entries=[];
    this.$exchange_order.next(this.exchange_order);
  } 

  set(exchange_order:ExchangeOrder)
  {
    this.exchange_order = exchange_order;
    this.$exchange_order.next( this.exchange_order);
  } 
}
