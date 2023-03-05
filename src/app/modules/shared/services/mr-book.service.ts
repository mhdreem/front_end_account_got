import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MrBookSearchReq } from '../models/mr-book-search-req';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class MrBookService extends BaseAPIService{

  constructor(protected override httpClient: HttpClient) { 
    super(httpClient)
  }

  search(obj: MrBookSearchReq) {
    return this.httpClient.post(this.RestUrl + "Accounts_Teacher/Search", obj, this.httpOptions);
  }
}
