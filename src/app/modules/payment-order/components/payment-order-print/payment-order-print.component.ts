import { Component, Input, SimpleChanges } from '@angular/core';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { account_center } from 'src/app/modules/shared/models/account_center';

import { payment_order } from 'src/app/modules/shared/models/payment_order';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { PaymentOrderService } from 'src/app/modules/shared/services/payment-order.service';
import { result } from 'src/app/modules/shared/models/result';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-order-print',
  templateUrl: './payment-order-print.component.html',
  styleUrls: ['./payment-order-print.component.scss']
})
export class PaymentOrderPrintComponent {
  @Input() payment_order: payment_order;
  @Input() seq?: number;


  _Subscription!: Subscription;
  accounts_tree_list: accounts_tree[];
  account_center_list: account_center[];
  
  accounts_name: string[]= [];
  accounts_center: string[]= [];
  debtor_sum: number= 0;
  creditor_sum: number= 0;
  today_date: Date= new Date();
  
  constructor(
    private accountTreeService: AccountTreeService,
    private account_centerService: account_centerService,
    private PaymentOrderService:PaymentOrderService
    ){

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes != null && changes['seq'] != null && changes['seq'].currentValue != null && changes['seq'].currentValue > 0) {
      this.seq = changes['seq'].currentValue;
      this.Load_data();
    }

  }





  Load_data() {
    this._Subscription = forkJoin(
      this.Load_Account_Tree(),
      this.Load_Account_Center(),
      this.load_payment_order(this.seq)

    ).subscribe(
      res => {

        this.accounts_tree_list = res[0];
       
        this.accountTreeService.List_AccountsTree = this.accounts_tree_list;
        this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.accountTreeService.List_AccountsTree);

        this.account_center_list = res[1];
       
        this.account_centerService.List_account_center = this.account_center_list;
        this.account_centerService.List_account_center_BehaviorSubject.next(this.account_center_list);


        if (res != null && res[2].value != null) {
          this.payment_order = res[2].value;
        }

        if (this.payment_order != null) {

          if (this.payment_order.payment_order_attachements== undefined || 
            this.payment_order.payment_order_attachements== null )
            {
              this.payment_order.payment_order_attachements = [];
            }

            if (this.payment_order.payment_order_details== undefined || 
              this.payment_order.payment_order_details== null )
              {
                this.payment_order.payment_order_details = [];
              }


          this.payment_order.payment_order_details?.sort((a, b) => a.debtor! - b.debtor!);
          this.payment_order.payment_order_details?.forEach(detail => {
            this.debtor_sum += detail.debtor!;
            this.creditor_sum += detail.creditor!;
          });


          this.payment_order.payment_order_details?.forEach(detail => {

            var arr_accounts_tree = this.accounts_tree_list.filter(account => account.seq == detail?.accounts_tree_fk);
            if (arr_accounts_tree!= null && arr_accounts_tree.length>0)
            {
              var account_tree = arr_accounts_tree[0];

              if (account_tree.account_name!= null)
              this.accounts_name.push(
                account_tree.account_name
                );
            }

            var arr_accounts_center = this.account_center_list.filter(account => account.account_center_seq == detail?.account_center_fk);
            if (arr_accounts_center!= null && arr_accounts_center.length>0)
            {
              var account_center = arr_accounts_center[0];

              if (account_center.account_center_name!= null)
              this.accounts_center.push(
                account_center. account_center_name
                );
            }


            
      
          });

        }
      }
    )
  }

  public load_payment_order(payment_order_seq: number | number | undefined): Observable<result> {

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

  Load_Account_Tree(): Observable<accounts_tree[]> {
    if (this.accountTreeService.List_AccountsTree == null ||
      this.accountTreeService.List_AccountsTree == undefined ||
      this.accountTreeService.List_AccountsTree.length == 0)
      return this.accountTreeService.list();
    return of(this.accountTreeService.List_AccountsTree);
  }


  Load_Account_Center(): Observable<account_center[]> {
    if (this.account_centerService.List_account_center == null ||
      this.account_centerService.List_account_center == undefined ||
      this.account_centerService.List_account_center.length == 0)
      return this.account_centerService.list();
    return of(this.account_centerService.List_account_center);
  }


  getValue(property_name: string): string {
    if (this.payment_order != null && property_name != null && this.payment_order[property_name as keyof typeof this.payment_order] != null) {
      var temp = this.payment_order[property_name as keyof typeof this.payment_order];
      if (temp != null && typeof temp === "number") {
        return temp.toString();
      } else if (temp != null && typeof temp === "string") {
        return temp.toString();
      } else if (temp != null && typeof temp === "object" && property_name.includes('date')) {
        if (moment(temp.toString()).isValid())
          return moment(temp.toString()).format('DD/MM/YYYY');
      }

    }

    return '';

  }

  getByObject(obj: any, property_name: string): string {
    if (obj != null && property_name != null && obj[property_name as any] != null) {
      var temp = obj[property_name as any];
      if (temp != null && typeof temp === "number") {
        return temp.toString();
      } else if (temp != null && typeof temp === "string") {
        return temp.toString();
      } else if (temp != null && typeof temp === "object" && property_name.includes('date')) {
        if (moment(temp.toString()).isValid())
          return moment(temp.toString()).format('DD/MM/YYYY');
      }

    }

    return '';

  }
}
