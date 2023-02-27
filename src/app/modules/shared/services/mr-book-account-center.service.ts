import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { accounts_transactions } from '../models/accounts_transactions';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class MrBookAccountCenterService  extends BaseAPIService{

  constructor(protected override httpClient: HttpClient) { 
    super(httpClient)
  }

  search(obj: accounts_transactions) {
    return this.httpClient.post(this.RestUrl + "Cost_Center_Teacher/Search", obj, this.httpOptions);
  }
}
