import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { account_final } from '../models/account-final';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountFinalService extends BaseAPIService{

  public List_AccountsFinal:account_final[] = [];

  public List_AccountFinal_BehaviorSubject:BehaviorSubject<account_final[]> = new BehaviorSubject<account_final[]>([]);


  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list():   Observable<account_final[]>{
      return this.httpClient.get <account_final[]>(this.RestUrl +"Account_Final/list",this.httpOptions) ;  
    
  }


  fill()  {
    this.Subscription.add(
      this.httpClient.get<account_final[]>(this.RestUrl +"Account_Final/list",this.httpOptions) .subscribe    (
        data=>
        {
          this.List_AccountsFinal = data;
          this.List_AccountFinal_BehaviorSubject.next(this.List_AccountsFinal);
        }
       )
    );
   
    
  }

  delete(id:number )  {
      return this.httpClient.delete(this.RestUrl +"Account_Final/delete/"+id,this.httpOptions);  
  }

  add(obj : account_final )  {
      return this.httpClient.post(this.RestUrl +"Account_Final/add",obj,this.httpOptions);  
  }

  update(obj : account_final )  {
       return this.httpClient.put(this.RestUrl +"Account_Final/update",obj,this.httpOptions);  
  }

  validate_name(obj: account_final) {
    return this.httpClient.post(this.RestUrl + "Account_Final/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Account_Final/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Account_Final/importExcel",formData);
  }
}
