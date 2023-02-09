import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { department } from '../models/department';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseAPIService {

  public List_Department: department[] = [];

  public List_Department_BehaviorSubject: BehaviorSubject<department[]> = new BehaviorSubject<department[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list(): Observable<department[]> {
    return this.httpClient.get<department[]>(this.RestUrl + "department/list", this.httpOptions);

  }


  fill() {

    this.Subscription.add(this.httpClient.get<department[]>(this.RestUrl + "department/list", this.httpOptions).subscribe(
      data => {
        this.List_Department = data;
        this.List_Department_BehaviorSubject.next(this.List_Department);
      }
    ))

  }

  delete(id: number) {
    return this.httpClient.delete(this.RestUrl + "department/delete/" + id, this.httpOptions);
  }

  add(obj: department) {
    return this.httpClient.post(this.RestUrl + "department/add", obj, this.httpOptions);
  }

  update(obj: department) {
    return this.httpClient.put(this.RestUrl + "department/update", obj, this.httpOptions);
  }

  validate_name(obj: department) {
    return this.httpClient.post(this.RestUrl + "department/Validate_Name", obj, this.httpOptions);
  }

  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "department/OrderRow", req, this.httpOptions);
  }
}
