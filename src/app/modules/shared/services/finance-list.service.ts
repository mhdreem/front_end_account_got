import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finance_list } from '../models/finance_list';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceListService extends BaseAPIService{

  public List_FinanceList:finance_list[] = [];

  public List_FinanceList_BehaviorSubject:BehaviorSubject<finance_list[]> = new BehaviorSubject<finance_list[]>([]);
 
  constructor(protected override httpClient : HttpClient) {
    super(httpClient)
   }

  list()  {
    return this.httpClient.get(this.RestUrl +"Finance_List/list",this.httpOptions) as Observable<finance_list[]>;  
    
  }


  fill()  {
     this.httpClient.get<finance_list[]>(this.RestUrl +"Finance_List/list",this.httpOptions) .subscribe    (
      data=>
      {
        this.List_FinanceList = data;
        this.List_FinanceList_BehaviorSubject.next(this.List_FinanceList);
      }
     )
    
  }

  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"Finance_List/delete/"+id,this.httpOptions);  
  }

  add(obj : finance_list )  {
    return this.httpClient.post(this.RestUrl +"Finance_List/add",obj,this.httpOptions);  
  }

  update(obj : finance_list )  {
    return this.httpClient.put(this.RestUrl +"Finance_List/update",obj,this.httpOptions);  
  }

  validate_name(obj: finance_list) {
    return this.httpClient.post(this.RestUrl + "Finance_List/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Finance_List/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Finance_List/importExcel",formData);
  }
}
