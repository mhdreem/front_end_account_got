import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewBalance } from '../models/review-balance';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewBalanceService extends BaseAPIService{

  constructor(protected override httpClient : HttpClient) { 
    super(httpClient)
  }

  search(obj : ReviewBalance )  {
    return this.httpClient.post(this.RestUrl +"Trial_Balance/Search/",obj,this.httpOptions);  
  }
}
