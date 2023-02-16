import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { payment_order_stage } from '../models/payment_order_stage';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentOrderStageService extends BaseAPIService {

  public List_PaymentOrderStage: payment_order_stage[] = [];

  public List_PaymentOrderStage_BehaviorSubject: BehaviorSubject<payment_order_stage[]> = new BehaviorSubject<payment_order_stage[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list(): Observable<payment_order_stage[]> {
    return this.httpClient.get<payment_order_stage[]>(this.RestUrl + "Payment_Order_Stage/list", this.httpOptions);

  }


  fill() {

    this.Subscription.add(this.httpClient.get<payment_order_stage[]>(this.RestUrl + "Payment_Order_Stage/list", this.httpOptions).subscribe(
      data => {
        this.List_PaymentOrderStage = data;
        this.List_PaymentOrderStage_BehaviorSubject.next(this.List_PaymentOrderStage);
      }
    ))

  }

  delete(id: number) {
    return this.httpClient.delete(this.RestUrl + "Payment_Order_Stage/delete/" + id, this.httpOptions);
  }

  add(obj: payment_order_stage) {
    return this.httpClient.post(this.RestUrl + "Payment_Order_Stage/add", obj, this.httpOptions);
  }

  update(obj: payment_order_stage) {
    return this.httpClient.put(this.RestUrl + "Payment_Order_Stage/update", obj, this.httpOptions);
  }

  validate_name(obj: payment_order_stage) {
    return this.httpClient.post(this.RestUrl + "Payment_Order_Stage/Validate_Stage_Name", obj, this.httpOptions);
  }

  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Payment_Order_Stage/OrderRow", req, this.httpOptions);
  }
}
