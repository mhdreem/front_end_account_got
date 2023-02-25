import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sanad_kid_stage } from '../models/sanad_kid_stage';
import { BaseAPIService } from './base/base-api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SanadKidStageService extends BaseAPIService {

  public List_Sanad_kid_stage: Sanad_kid_stage[] = [];

  public List_Sanad_kid_stage_BehaviorSubject: BehaviorSubject<Sanad_kid_stage[]> = new BehaviorSubject<Sanad_kid_stage[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list(): Observable<Sanad_kid_stage[]> {
    return this.httpClient.get<Sanad_kid_stage[]>(this.RestUrl + "Sanad_Kid_Stage/list", this.httpOptions);

  }


  fill() {

    this.Subscription.add(this.httpClient.get<Sanad_kid_stage[]>(this.RestUrl + "Sanad_Kid_Stage/list", this.httpOptions).subscribe(
      data => {
        this.List_Sanad_kid_stage = data;
        this.List_Sanad_kid_stage_BehaviorSubject.next(this.List_Sanad_kid_stage);
      }
    ))

  }

  delete(id: number) {
    return this.httpClient.delete(this.RestUrl + "Sanad_Kid_Stage/delete/" + id, this.httpOptions);
  }

  add(obj: Sanad_kid_stage) {
    return this.httpClient.post(this.RestUrl + "Sanad_Kid_Stage/add", obj, this.httpOptions);
  }

  update(obj: Sanad_kid_stage) {
    return this.httpClient.put(this.RestUrl + "Sanad_Kid_Stage/update", obj, this.httpOptions);
  }

  validate_name(obj: Sanad_kid_stage) {
    return this.httpClient.post(this.RestUrl + "Sanad_Kid_Stage/Validate_Stage_Name", obj, this.httpOptions);
  }

  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Sanad_Kid_Stage/OrderRow", req, this.httpOptions);
  }
}
