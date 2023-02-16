import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { receipt_order_stage } from '../models/receipt_order_stage';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptOrderStageService extends BaseAPIService{

  public List_ReceiptOrderStage: receipt_order_stage[] = [];

  public List_ReceiptOrderStage_BehaviorSubject: BehaviorSubject<receipt_order_stage[]> = new BehaviorSubject<receipt_order_stage[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list(): Observable<receipt_order_stage[]> {
    return this.httpClient.get<receipt_order_stage[]>(this.RestUrl + "Receipt_Order_Stage/list", this.httpOptions);

  }


  fill() {

    this.Subscription.add(this.httpClient.get<receipt_order_stage[]>(this.RestUrl + "Receipt_Order_Stage/list", this.httpOptions).subscribe(
      data => {
        this.List_ReceiptOrderStage = data;
        this.List_ReceiptOrderStage_BehaviorSubject.next(this.List_ReceiptOrderStage);
      }
    ))

  }

  delete(id: number) {
    return this.httpClient.delete(this.RestUrl + "Receipt_Order_Stage/delete/" + id, this.httpOptions);
  }

  add(obj: receipt_order_stage) {
    return this.httpClient.post(this.RestUrl + "Receipt_Order_Stage/add", obj, this.httpOptions);
  }

  update(obj: receipt_order_stage) {
    return this.httpClient.put(this.RestUrl + "Receipt_Order_Stage/update", obj, this.httpOptions);
  }

  validate_name(obj: receipt_order_stage) {
    return this.httpClient.post(this.RestUrl + "Receipt_Order_Stage/Validate_Stage_Name", obj, this.httpOptions);
  }

  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Receipt_Order_Stage/OrderRow", req, this.httpOptions);
  }
}
