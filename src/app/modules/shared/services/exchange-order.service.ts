import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { exchange_order } from '../models/exchange_order';
import { BaseAPIService } from './base/base-api.service';
import { UserService } from './user.service';
import { result } from '../models/result';


@Injectable({
  providedIn: 'root'
})
export class ExchangeOrderService extends BaseAPIService{

  public List_ExchangeOrder:exchange_order[] = [];

  public List_ExchangeOrder_BehaviorSubject:BehaviorSubject<exchange_order[]> = new BehaviorSubject<exchange_order[]>([]);

  constructor(protected override httpClient : HttpClient,
    private userService :UserService ) {
      super(httpClient)
     }

  list()  {
    return this.httpClient.get(this.RestUrl +"Exchange_Order/list",this.httpOptions) as Observable<exchange_order[]>;  
    
  }


  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"Exchange_Order/delete/"+id,this.httpOptions);  
  }

  add(obj : exchange_order )  {
    let user_fk= this.userService.Login_User.user_seq;
    return this.httpClient.post(this.RestUrl +"Exchange_Order/add/"+user_fk,obj,this.httpOptions);  
  }

  update(obj : exchange_order )  {
    let user_fk= this.userService.Login_User.user_seq;
    return this.httpClient.put(this.RestUrl +"Exchange_Order/update/"+user_fk,obj,this.httpOptions);  
  }

  search(req : any )  {
    return this.httpClient.post(this.RestUrl +"Exchange_Order/Search",req,this.httpOptions);  
  }

  getById(id: number){
    return this.httpClient.get(this.RestUrl +"Exchange_Order/GetByID/"+id,this.httpOptions) as Observable<exchange_order>;  
    
  }

  getBySeq(seq: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +"Exchange_Order/GetBySeq/"+seq,this.httpOptions) as Observable<result>;  
    
  }


  generate_incumbent_id(incumbent_id_generate_type_fk: number,month: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +`Exchange_Order/generate_incumbent_id/${incumbent_id_generate_type_fk}/${month}`,this.httpOptions) as Observable<result>;      
  }


  generate_document_id(incumbent_id_generate_type_fk: number,month: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +`Exchange_Order/generate_document_id/${incumbent_id_generate_type_fk}/${month}`,this.httpOptions) as Observable<result>;      
  }

  export2Excel() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
      return this.httpClient.post<any>( this.RestUrl +'Exchange_Order/ExportExcel', this.httpOptions,
          {headers: headers, responseType: 'blob' as 'json' }
        );
  }

}
