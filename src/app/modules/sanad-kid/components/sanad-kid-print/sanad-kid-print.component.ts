import { Component, Input, OnInit , OnChanges} from '@angular/core';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';

@Component({
  selector: 'app-sanad-kid-print',
  templateUrl: './sanad-kid-print.component.html',
  styleUrls: ['./sanad-kid-print.component.scss']
})
export class SanadKidPrintComponent implements OnInit, OnChanges {

  @Input() data: sanad_kid;

  _Subscription!: Subscription;
  accounts_tree_list: accounts_tree[];
  accounts_name: string[]= [];
  debtor_sum: number= 0;
  creditor_sum: number= 0;
  today_date: Date= new Date();
  
  constructor(private accountTreeService: AccountTreeService){

  }

  ngOnInit(){
    
  }

  ngOnChanges(){
    this.Load_Data();
    this.data.sanad_kid_details?.sort((a, b)=> a.debtor! - b.debtor! );
    this.data.sanad_kid_details?.forEach(detail =>{
      this.debtor_sum+= detail.debtor!;
      this.creditor_sum+= detail.creditor!;
    });
    console.log('this.data.sanad_kid_details', this.data.sanad_kid_details);
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

        if (this.data != null)
        this.data.sanad_kid_details?.forEach(detail =>{
          this.accounts_name.push(
            this.accounts_tree_list.find(account=> account.seq== detail?.accounts_tree_fk)!.account_name!
          );
        });
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
