import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { account_level } from '../models/account_level';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountLevelService extends BaseAPIService{

  public List_AccountLevel:account_level[] = [];

  public List_AccountLevel_BehaviorSubject:BehaviorSubject<account_level[]> = new BehaviorSubject<account_level[]>([]);

  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }


  list() :Observable<account_level[]> {
     return this.httpClient.get<account_level[]>(this.RestUrl +"Account_Level/list",this.httpOptions) ;  
    
  }


  fill()  {
    this.Subscription.add(
         this.httpClient.get<account_level[]>(this.RestUrl +"Account_Level/list",this.httpOptions) .subscribe    (
      data=>
      {
        this.List_AccountLevel = data;
        this.List_AccountLevel_BehaviorSubject.next(this.List_AccountLevel);
      }
     ));

    
    
  }

  delete(id:number )  {
     return this.httpClient.delete(this.RestUrl +"Account_Level/delete/"+id,this.httpOptions);  
  }

  add(obj : account_level )  {
     return this.httpClient.post(this.RestUrl +"Account_Level/add",obj,this.httpOptions);  
  }

  update(obj : account_level )  {
       return this.httpClient.put(this.RestUrl +"Account_Level/update",obj,this.httpOptions);  
  }

  validate_name(obj: account_level) {
    return this.httpClient.post(this.RestUrl + "Account_Level/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Account_Level/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Account_Level/importExcel",formData);
  }
}
