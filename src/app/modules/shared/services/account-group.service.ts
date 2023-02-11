import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { account_group } from '../models/account_group';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGroupService extends BaseAPIService{

  public List_AccountGroup:account_group[] = [];

  public List_AccountGroup_BehaviorSubject:BehaviorSubject<account_group[]> = new BehaviorSubject<account_group[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list() :Observable<account_group[]>  {
      return this.httpClient.get<account_group[]>(this.RestUrl +"Account_Group/list",this.httpOptions) ;  
    
  }


  fill()  {
    this.Subscription.add(
      this.httpClient.get<account_group[]>(this.RestUrl +"Account_Group/list",this.httpOptions) .subscribe    (
        data=>
        {
          this.List_AccountGroup = data;
          this.List_AccountGroup_BehaviorSubject.next(this.List_AccountGroup);
        }
       )
    );


      
    
  }

  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"Account_Group/delete/"+id,this.httpOptions);  
  }

  add(obj : account_group )  {
      return this.httpClient.post(this.RestUrl +"Account_Group/add",obj,this.httpOptions);  
  }

  update(obj : account_group )  {
      return this.httpClient.put(this.RestUrl +"Account_Group/update",obj,this.httpOptions);  
  }

  validate_name(obj: account_group) {
    return this.httpClient.post(this.RestUrl + "Account_Group/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Account_Group/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Account_Group/importExcel",formData);
  }
}
