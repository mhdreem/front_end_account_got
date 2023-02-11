import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubscriptSizing } from '@angular/material/form-field';
import { BehaviorSubject, Observable } from 'rxjs';
import { account_type } from '../models/account_type';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class account_typeService  extends BaseAPIService{

  public List_account_type:account_type[] = [];
  public List_account_type_BehaviorSubject:BehaviorSubject<account_type[]> = new BehaviorSubject<account_type[]>([]);
  

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  list() :Observable<account_type[]> {
    return this.httpClient.get<account_type[]>(this.RestUrl +"Account_Type/list",this.httpOptions) ;      
  }


  fill()  {
    this.Subscription =  this.httpClient.get<account_type[]>(this.RestUrl +"Account_Type/list",this.httpOptions) .subscribe    (
      data=>
      {
        this.List_account_type = data;
        this.List_account_type_BehaviorSubject.next(this.List_account_type);
      }
     )    
  }

  delete(id:number )  {  
    return this.httpClient.delete(this.RestUrl +"Account_Type/delete/"+id);  
  }

  add(obj : account_type )  {    
    return this.httpClient.post(this.RestUrl +"Account_Type/add",obj,this.httpOptions);  
  }

  update(obj : account_type )  {   
    return this.httpClient.put(this.RestUrl +"Account_Type/update",this.httpOptions);  
  }

  validate_name(obj: account_type) {
    return this.httpClient.post(this.RestUrl + "Account_Type/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Account_Type/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Account_Type/importExcel",formData);
  }
}
