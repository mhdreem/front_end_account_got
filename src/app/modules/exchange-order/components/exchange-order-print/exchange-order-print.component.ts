import { Component, Input } from '@angular/core';
import { exchange_order } from 'src/app/modules/shared/models/exchange_order';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';

@Component({
  selector: 'app-exchange-order-print',
  templateUrl: './exchange-order-print.component.html',
  styleUrls: ['./exchange-order-print.component.scss']
})
export class ExchangeOrderPrintComponent {
  @Input() data: exchange_order;

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
    private account_centerService: account_centerService
    ){

  }

  ngOnInit(){
    
  }

  ngOnChanges(){
    this.Load_Data();
    this.data.exchange_order_details?.sort((a, b)=> a.debtor! - b.debtor! );
    this.data.exchange_order_details?.forEach(detail =>{
      this.debtor_sum+= detail.debtor!;
      this.creditor_sum+= detail.creditor!;
    });
    console.log('this.data.sanad_kid_details', this.data.exchange_order_details);
  }

  Load_Data() {
    this._Subscription = forkJoin(
      this.Load_Account_Tree(),
      this.Load_Account_Center()
    ).subscribe(
      res => {
        this.accounts_tree_list = res[0];
        // this.accounts_tree_filter = of(this.accounts_tree_list);
        this.accountTreeService.List_AccountsTree = this.accounts_tree_list;
        this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.accountTreeService.List_AccountsTree);

        this.account_center_list = res[1];
        // this.account_center_filter = of(this.account_center_list);
        this.account_centerService.List_account_center = this.account_center_list;
        this.account_centerService.List_account_center_BehaviorSubject.next(this.account_center_list);

        if (this.data != null){

        this.data.exchange_order_details?.forEach(detail =>{
          this.accounts_name.push(
            this.accounts_tree_list.find(account=> account.seq== detail?.accounts_tree_fk)!.account_name!
          );
          this.accounts_center.push(
            this.account_center_list.find(account=> account.account_center_seq== detail?.account_center_fk)!.account_center_name!
          );
        });
        console.log('this.account_center_list', this.account_center_list);
        
      }
    }
    )
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
}
