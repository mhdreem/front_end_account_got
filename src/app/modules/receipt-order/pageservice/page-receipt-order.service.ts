import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { receipt_order } from '../../shared/models/receipt_order';

@Injectable({
  providedIn: 'root'
})
export class PageReceiptOrderService {

  public receipt_order : receipt_order;
  public $receipt_order : BehaviorSubject<receipt_order> ;
 

  
  constructor() { 
    this.receipt_order = {};
    this.receipt_order.receipt_order_details=[];
    this.receipt_order.receipt_order_attachements=[];
    this.receipt_order.receipt_order_entries=[];
    this.$receipt_order  = new  BehaviorSubject<receipt_order>({});
  }

  new()
  {
    this.receipt_order = {};
    this.receipt_order.receipt_order_details=[];
    this.receipt_order.receipt_order_attachements=[];
    this.receipt_order.receipt_order_entries=[];
    this.$receipt_order.next(this.receipt_order);
  } 

  set(receipt_order:receipt_order)
  {
    this.receipt_order = receipt_order;
    this.$receipt_order.next( this.receipt_order);
  } 
}
