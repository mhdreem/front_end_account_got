import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { branch } from '../models/branch';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseAPIService {

  public List_Branch:branch[] = [];

  public List_Branch_BehaviorSubject:BehaviorSubject<branch[]> = new BehaviorSubject<branch[]>([]);


  constructor(protected override httpClient : HttpClient) { 
    super(httpClient);
  }


  list():Observable<branch[]>  {
    return this.httpClient.get(this.RestUrl +"Branch/list",this.httpOptions) as Observable<branch[]>;  
  }


  fill()  {
    this.Subscription.add(  this.httpClient.get<branch[]>(this.RestUrl +"Branch/list",this.httpOptions) .subscribe    (
      data=>
      {
        this.List_Branch = data;
        this.List_Branch_BehaviorSubject.next(this.List_Branch);
      }
    
     )
    );
  }

  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"Branch/delete/"+id,this.httpOptions);  
  }

  add(obj : branch )  {
    return this.httpClient.post(this.RestUrl +"Branch/add",obj,this.httpOptions);  
  }

  update(obj : branch )  {  
    return this.httpClient.put(this.RestUrl +"Branch/update",obj,this.httpOptions);  
  }

  validate_name(obj : branch){
      return this.httpClient.post(this.RestUrl +"Branch/Validate_Name",obj,this.httpOptions);
  }

  orderRow(req : any[] )  {
    return this.httpClient.post(this.RestUrl +"Branch/OrderRow",req,this.httpOptions);  
  }

}
