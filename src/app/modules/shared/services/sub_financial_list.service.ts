import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { sub_financial_list } from "../models/sub_financial_list";
import { BaseAPIService } from "./base/base-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class SubFinancialListService extends BaseAPIService {
  
    public List_sub_financial_list: sub_financial_list[] = [];
  
    public List_sub_financial_list_BehaviorSubject: BehaviorSubject<sub_financial_list[]> = new BehaviorSubject<sub_financial_list[]>([]);
  
  
  
    constructor(protected override httpClient: HttpClient) {
      super(httpClient)
    }
  
    list(): Observable<sub_financial_list[]> {
      return this.httpClient.get<sub_financial_list[]>(this.RestUrl + "Sub_Financial_List/list", this.httpOptions);
  
    }
  
  
    fill() {
  
      this.Subscription.add(this.httpClient.get<sub_financial_list[]>(this.RestUrl + "Sub_Financial_List/list", this.httpOptions).subscribe(
        data => {
          this.List_sub_financial_list = data;
          this.List_sub_financial_list_BehaviorSubject.next(this.List_sub_financial_list);
        }
      ))
  
    }
  
    delete(id: number) {
      return this.httpClient.delete(this.RestUrl + "Sub_Financial_List/delete/" + id, this.httpOptions);
    }
  
    add(obj: sub_financial_list) {
      return this.httpClient.post(this.RestUrl + "Sub_Financial_List/add", obj, this.httpOptions);
    }
  
    update(obj: sub_financial_list) {
      return this.httpClient.put(this.RestUrl + "Sub_Financial_List/update", obj, this.httpOptions);
    }
  
    validate_name(obj: sub_financial_list) {
      return this.httpClient.post(this.RestUrl + "Sub_Financial_List/Validate_Name", obj, this.httpOptions);
    }
  
    orderRow(req: any[]) {
      return this.httpClient.post(this.RestUrl + "Sub_Financial_List/OrderRow", req, this.httpOptions);
    }
  }
  