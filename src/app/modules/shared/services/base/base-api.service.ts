import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseAPIService  implements OnDestroy{

  Subscription:Subscription = new Subscription() ;
  protected RestUrl = environment.APIURL;
  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
  };
  constructor(protected httpClient: HttpClient) {
  }
  ngOnDestroy(): void {
   if (this.Subscription != null )
    this.Subscription.unsubscribe();
  }

}
