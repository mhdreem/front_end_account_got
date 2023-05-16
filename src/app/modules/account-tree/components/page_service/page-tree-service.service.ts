import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';

@Injectable({
  providedIn: 'root'
})
export class PageTreeServiceService {

  public $account_tree: BehaviorSubject<accounts_tree> = new   BehaviorSubject<accounts_tree>({});
  public $parent_account_tree: BehaviorSubject<accounts_tree> = new   BehaviorSubject<accounts_tree>({});


  constructor() { }
}
