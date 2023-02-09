import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { account_center } from '../models/account-center';
import { BaseAPIService } from './base/base-api.service';


@Injectable({
  providedIn: 'root'
})
export class account_centerService extends BaseAPIService {

  public List_account_center: account_center[] = [];

  public List_account_center_BehaviorSubject: BehaviorSubject<account_center[]> = new BehaviorSubject<account_center[]>([]);


  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list(): Observable<account_center[]> {
    return this.httpClient.get<account_center[]>(this.RestUrl + "Account_Center/list", this.httpOptions);
  }


  fill() {

    this.Subscription = this.httpClient.get<account_center[]>(this.RestUrl + "Account_Center/list", this.httpOptions).subscribe(
      data => {
        this.List_account_center = data;
        this.List_account_center_BehaviorSubject.next(this.List_account_center);
      }
    )

  }

  delete(id: number) {

    return this.httpClient.delete(this.RestUrl + "Account_Center/delete/" + id, this.httpOptions);
  }

  add(obj: account_center) {
    console.log('obj',obj);
    return this.httpClient.post(this.RestUrl + "Account_Center/add", obj);
  }

  update(obj: account_center) {
    return this.httpClient.put(this.RestUrl + "Account_Center/update", obj, this.httpOptions);
  }

  validate_name(obj: account_center) {
    console.log('accountCenter1');

    return this.httpClient.post(this.RestUrl + "Account_Center/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Account_Center/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Account_Center/importExcel",formData);
  }

}
