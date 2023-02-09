import { Injectable } from '@angular/core';
import { ExchangeOrderStage } from '../models/exchange-order-stage';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeOrderStageService extends BaseAPIService {

  public List_ExchangeOrderStage: ExchangeOrderStage[] = [];

  public List_ExchangeOrderStage_BehaviorSubject: BehaviorSubject<ExchangeOrderStage[]> = new BehaviorSubject<ExchangeOrderStage[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list(): Observable<ExchangeOrderStage[]> {
    return this.httpClient.get<ExchangeOrderStage[]>(this.RestUrl + "Exchange_Order_Stage/list", this.httpOptions);

  }


  fill() {

    this.Subscription.add(this.httpClient.get<ExchangeOrderStage[]>(this.RestUrl + "Exchange_Order_Stage/list", this.httpOptions).subscribe(
      data => {
        this.List_ExchangeOrderStage = data;
        this.List_ExchangeOrderStage_BehaviorSubject.next(this.List_ExchangeOrderStage);
      }
    ))

  }

  delete(id: number) {
    return this.httpClient.delete(this.RestUrl + "Exchange_Order_Stage/delete/" + id, this.httpOptions);
  }

  add(obj: ExchangeOrderStage) {
    return this.httpClient.post(this.RestUrl + "Exchange_Order_Stage/add", obj, this.httpOptions);
  }

  update(obj: ExchangeOrderStage) {
    return this.httpClient.put(this.RestUrl + "Exchange_Order_Stage/update", obj, this.httpOptions);
  }

  validate_name(obj: ExchangeOrderStage) {
    return this.httpClient.post(this.RestUrl + "Exchange_Order_Stage/Validate_Stage_Name", obj, this.httpOptions);
  }

  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Exchange_Order_Stage/OrderRow", req, this.httpOptions);
  }
}
