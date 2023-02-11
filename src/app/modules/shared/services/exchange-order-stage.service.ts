import { Injectable } from '@angular/core';
import { exchange_order_stage } from '../models/exchange_order_stage';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeOrderStageService extends BaseAPIService {

  public List_ExchangeOrderStage: exchange_order_stage[] = [];

  public List_ExchangeOrderStage_BehaviorSubject: BehaviorSubject<exchange_order_stage[]> = new BehaviorSubject<exchange_order_stage[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list(): Observable<exchange_order_stage[]> {
    return this.httpClient.get<exchange_order_stage[]>(this.RestUrl + "Exchange_Order_Stage/list", this.httpOptions);

  }


  fill() {

    this.Subscription.add(this.httpClient.get<exchange_order_stage[]>(this.RestUrl + "Exchange_Order_Stage/list", this.httpOptions).subscribe(
      data => {
        this.List_ExchangeOrderStage = data;
        this.List_ExchangeOrderStage_BehaviorSubject.next(this.List_ExchangeOrderStage);
      }
    ))

  }

  delete(id: number) {
    return this.httpClient.delete(this.RestUrl + "Exchange_Order_Stage/delete/" + id, this.httpOptions);
  }

  add(obj: exchange_order_stage) {
    return this.httpClient.post(this.RestUrl + "Exchange_Order_Stage/add", obj, this.httpOptions);
  }

  update(obj: exchange_order_stage) {
    return this.httpClient.put(this.RestUrl + "Exchange_Order_Stage/update", obj, this.httpOptions);
  }

  validate_name(obj: exchange_order_stage) {
    return this.httpClient.post(this.RestUrl + "Exchange_Order_Stage/Validate_Stage_Name", obj, this.httpOptions);
  }

  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Exchange_Order_Stage/OrderRow", req, this.httpOptions);
  }
}
