import { Component, Input, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { receipt_order } from 'src/app/modules/shared/models/receipt_order';
import { result } from 'src/app/modules/shared/models/result';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { ReceiptOrderService } from 'src/app/modules/shared/services/receipt-order.service';

@Component({
  selector: 'app-receipt-order-print',
  templateUrl: './receipt-order-print.component.html',
  styleUrls: ['./receipt-order-print.component.scss']
})
export class ReceiptOrderPrintComponent {
  @Input() receipt_order: receipt_order;
  @Input() seq?: number;


  accounts_tree_list: accounts_tree[];
  account_center_list: account_center[];
  
  _Subscription!: Subscription;
  
  
  accounts_name: string[]= [];
  accounts_center: string[]= [];
  debtor_sum: number= 0;
  creditor_sum: number= 0;
  today_date: Date= new Date();
  
  constructor(
 
    private accountTreeService: AccountTreeService,
    private account_centerService: account_centerService,
    private ReceiptOrderService:ReceiptOrderService

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
      this.load_receipt_order(this.seq)

    ).subscribe(
      res => {

        this.accounts_tree_list = res[0];
       
        this.accountTreeService.List_AccountsTree = this.accounts_tree_list;
        this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.accountTreeService.List_AccountsTree);

        this.account_center_list = res[1];
       
        this.account_centerService.List_account_center = this.account_center_list;
        this.account_centerService.List_account_center_BehaviorSubject.next(this.account_center_list);


        if (res != null && res[2].value != null) {
          this.receipt_order = res[2].value;
        }

        if (this.receipt_order != null) {

          if (this.receipt_order.receipt_order_attachements== undefined || 
            this.receipt_order.receipt_order_attachements== null )
            {
              this.receipt_order.receipt_order_attachements = [];
            }

            if (this.receipt_order.receipt_order_details== undefined || 
              this.receipt_order.receipt_order_details== null )
              {
                this.receipt_order.receipt_order_details = [];
              }


          this.receipt_order.receipt_order_details?.sort((a, b) => a.debtor! - b.debtor!);
          this.receipt_order.receipt_order_details?.forEach(detail => {
            this.debtor_sum += detail.debtor!;
            this.creditor_sum += detail.creditor!;
          });


          this.receipt_order.receipt_order_details?.forEach(detail => {

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

  public load_receipt_order(receipt_order_seq: number | number | undefined): Observable<result> {

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
    if (this.receipt_order != null && property_name != null && this.receipt_order[property_name as keyof typeof this.receipt_order] != null) {
      var temp = this.receipt_order[property_name as keyof typeof this.receipt_order];
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
