import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { account_class } from '../models/account-class';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountClassService extends BaseAPIService{

  public List_AccountClass:account_class[] = [];

  public List_AccountClass_BehaviorSubject:BehaviorSubject<account_class[]> = new BehaviorSubject<account_class[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list() :Observable<account_class[]> {
      return this.httpClient.get<account_class[]>(this.RestUrl +"Account_Class/list",this.httpOptions) ;  
    
  }


  fill()  {

    this.Subscription.add(
      this.httpClient.get<account_class[]>(this.RestUrl +"Account_Class/list",this.httpOptions) .subscribe    (
        data=>
        {
          this.List_AccountClass = data;
          this.List_AccountClass_BehaviorSubject.next(this.List_AccountClass);
        }
       )
    );
        
    
  }

  delete(id:number )  {
     return this.httpClient.delete(this.RestUrl +"Account_Class/delete/"+id,this.httpOptions);  
  }

  add(obj : account_class )  {
     return this.httpClient.post(this.RestUrl +"Account_Class/add",obj,this.httpOptions);  
  }

  update(obj : account_class )  {
      return this.httpClient.put(this.RestUrl +"Account_Class/update",obj,this.httpOptions);  
  }

  validate_name(obj: account_class) {
    console.log('111');
    return this.httpClient.post(this.RestUrl + "Account_Class/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Account_Class/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Account_Class/importExcel",formData);
  }
}
