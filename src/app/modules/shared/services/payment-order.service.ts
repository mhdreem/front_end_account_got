import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { payment_order } from '../models/payment_order';
import { BaseAPIService } from './base/base-api.service';
import { UserService } from './user.service';
import { result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class PaymentOrderService extends BaseAPIService{

  public List_PaymentOrder:payment_order[] = [];

  public List_PaymentOrder_BehaviorSubject:BehaviorSubject<payment_order[]> = new BehaviorSubject<payment_order[]>([]);
 
  constructor(protected override httpClient : HttpClient,
    private userService :UserService) { 
    super(httpClient)

    }

  list()  {
    return this.httpClient.get(this.RestUrl +"Payment_Order/list",this.httpOptions) as Observable<payment_order[]>;  
    
  }


  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"Payment_Order/delete/"+id,this.httpOptions);  
  }

  add(obj : payment_order )  {
    let user_fk= this.userService.Login_User.user_seq;
    return this.httpClient.post(this.RestUrl +"Payment_Order/add/"+user_fk,obj,this.httpOptions);  
  }

  update(obj : payment_order )  {
    let user_fk= this.userService.Login_User.user_seq;
    return this.httpClient.put(this.RestUrl +"Payment_Order/update/"+user_fk,obj,this.httpOptions);  
  }

  search(req : any )  {
    return this.httpClient.post(this.RestUrl +"Payment_Order/Search",req,this.httpOptions);  
  }

  getById(id: number){
    return this.httpClient.get(this.RestUrl +"Payment_Order/GetByID/"+id,this.httpOptions) as Observable<payment_order>;  
    
  }

  getBySeq(seq: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +"Payment_Order/GetBySeq/"+seq,this.httpOptions) as Observable<result>;  
    
  }


  export2Excel() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
      return this.httpClient.post<any>( this.RestUrl +'Payment_Order/ExportExcel', this.httpOptions,
          {headers: headers, responseType: 'blob' as 'json' }
        );
  }


}
