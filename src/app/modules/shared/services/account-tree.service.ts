import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { accounts_tree } from '../models/accounts_tree';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountTreeService extends BaseAPIService{

  public List_AccountsTree:accounts_tree[] = [];

  public List_AccountsTree_BehaviorSubject:BehaviorSubject<accounts_tree[]> = new BehaviorSubject<accounts_tree[]>([]);


  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }


  list() : Observable<accounts_tree[]> {
    return this.httpClient.get<accounts_tree[]>(this.RestUrl +"Accounts_Tree/list",this.httpOptions) ;  
    
  }


  fill()  {
    this.Subscription.add(
      this.httpClient.get<accounts_tree[]>(this.RestUrl +"Accounts_Tree/list",this.httpOptions) .subscribe    (
        data=>
        {
          this.List_AccountsTree = data;
          this.List_AccountsTree_BehaviorSubject.next(this.List_AccountsTree);
        }
       )
      
    );

     
  }

  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"Accounts_Tree/delete/"+id,this.httpOptions);  
  }

  add(obj : accounts_tree )  {
   return this.httpClient.post(this.RestUrl +"Accounts_Tree/add",obj,this.httpOptions);  
  }

  update(obj : accounts_tree )  {
     return this.httpClient.put(this.RestUrl +"Accounts_Tree/update",obj,this.httpOptions);  
  }

  BuildTree()  {
     return this.httpClient.get(this.RestUrl +"Accounts_Tree/BuildTree",this.httpOptions) as Observable<accounts_tree>;      
  }

  search(req : any )  {   
    return this.httpClient.post(this.RestUrl +"Accounts_Tree/Search",req,this.httpOptions);  
  }

  validate_id(obj: accounts_tree) {
    return this.httpClient.post(this.RestUrl + "Accounts_Tree/validate_account_id", obj, this.httpOptions);
  }
  
  validate_name(obj: accounts_tree) {
    return this.httpClient.post(this.RestUrl + "Accounts_Tree/validate_account_name", obj, this.httpOptions);
  }

  get_by_seq(seq: number){
    return this.httpClient.get<accounts_tree>(this.RestUrl +"Accounts_Tree/GetBySeq/"+seq,this.httpOptions) ;  
  }
}
