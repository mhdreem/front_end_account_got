import { Component, Input } from '@angular/core';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { receipt_order } from 'src/app/modules/shared/models/receipt_order';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';

@Component({
  selector: 'app-receipt-order-print',
  templateUrl: './receipt-order-print.component.html',
  styleUrls: ['./receipt-order-print.component.scss']
})
export class ReceiptOrderPrintComponent {
  @Input() data: receipt_order;

  _Subscription!: Subscription;
  accounts_tree_list: accounts_tree[];
  
  accounts_name: string[]= [];
  accounts_center: string[]= [];
  debtor_sum: number= 0;
  creditor_sum: number= 0;
  today_date: Date= new Date();
  
  constructor(
    private accountTreeService: AccountTreeService,
    ){

  }

  ngOnInit(){
    
  }

  ngOnChanges(){
    console.log('data', this.data);
    this.Load_Data();
    this.data.receipt_order_details?.sort((a, b)=> a.debtor! - b.debtor! );
    this.data.receipt_order_details?.forEach(detail =>{
      this.debtor_sum+= detail.debtor!;
      this.creditor_sum+= detail.creditor!;
    });
    console.log('this.data.sanad_kid_details', this.data.receipt_order_details);
  }

  Load_Data() {
    this._Subscription = forkJoin(
      this.Load_Account_Tree(),
    ).subscribe(
      res => {
        this.accounts_tree_list = res[0];
        // this.accounts_tree_filter = of(this.accounts_tree_list);
        this.accountTreeService.List_AccountsTree = this.accounts_tree_list;
        this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.accountTreeService.List_AccountsTree);

        if (this.data != null){

        this.data.receipt_order_details?.forEach(detail =>{
          this.accounts_name.push(
            this.accounts_tree_list.find(account=> account.seq== detail?.accounts_tree_fk)!.account_name!
          );
          
        });
        
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

  
}
