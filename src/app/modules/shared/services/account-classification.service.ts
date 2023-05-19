import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {AccountClassification} from '../models/account-classification'
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountclassificationService extends BaseAPIService {

  public List_Accountclassification:AccountClassification[] = [];

  public List_Accountclassification_BehaviorSubject:BehaviorSubject<AccountClassification[]> = new BehaviorSubject<AccountClassification[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list() :Observable<AccountClassification[]> {
      return this.httpClient.get<AccountClassification[]>(this.RestUrl +"Account_Classification/list",this.httpOptions) ;  
    
  }


  fill()  {

    this.Subscription.add(
      this.httpClient.get<AccountClassification[]>(this.RestUrl +"Account_Classification/list",this.httpOptions) .subscribe    (
        data=>
        {
          this.List_Accountclassification = data;
          this.List_Accountclassification_BehaviorSubject.next(this.List_Accountclassification);
        }
       )
    );
        
    
  }

  delete(id:number )  {
     return this.httpClient.delete(this.RestUrl +"Account_Classification/delete/"+id,this.httpOptions);  
  }

  add(obj : AccountClassification )  {
     return this.httpClient.post(this.RestUrl +"Account_Classification/add",obj,this.httpOptions);  
  }

  update(obj : AccountClassification )  {
      return this.httpClient.put(this.RestUrl +"Account_Classification/update",obj,this.httpOptions);  
  }

  validate_name(obj: AccountClassification) {
    console.log('111');
    return this.httpClient.post(this.RestUrl + "Account_Classification/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Account_Classification/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Account_Classification/importExcel",formData);
  }
}
