import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finance_list } from '../models/finance-list';

@Injectable({
  providedIn: 'root'
})
export class FinanceListService {

  public List_FinanceList:finance_list[] = [];

  public List_FinanceList_BehaviorSubject:BehaviorSubject<finance_list[]> = new BehaviorSubject<finance_list[]>([]);



  private RestUrl = 'https://localhost:7137/api/';
  // private RestUrl = 'http://localhost:8083/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Finance_List/list",options) as Observable<finance_list[]>;  
    
  }


  fill()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
     this.httpClient.get<finance_list[]>(this.RestUrl +"Finance_List/list",options) .subscribe    (
      data=>
      {
        this.List_FinanceList = data;
        this.List_FinanceList_BehaviorSubject.next(this.List_FinanceList);
      }
     )
    
  }

  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"Finance_List/delete/"+id,options);  
  }

  add(obj : finance_list )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"Finance_List/add",obj,options);  
  }

  update(obj : finance_list )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +"Finance_List/update",obj,options);  
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
