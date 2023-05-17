import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { receipt_order } from '../models/receipt_order';
import { BaseAPIService } from './base/base-api.service';
import { UserService } from './user.service';
import { result } from '../models/result';
@Injectable({
  providedIn: 'root'
})
export class ReceiptOrderService extends BaseAPIService{

  public List_ReceiptOrder:receipt_order[] = [];

  public List_ReceiptOrder_BehaviorSubject:BehaviorSubject<receipt_order[]> = new BehaviorSubject<receipt_order[]>([]);

  constructor(protected override httpClient : HttpClient,
    private userService :UserService) { 
      super(httpClient)

    }

  list()  {
    return this.httpClient.get(this.RestUrl +"Receipt_Order/list",this.httpOptions) as Observable<receipt_order[]>;  
    
  }


  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"Receipt_Order/delete/"+id,this.httpOptions);  
  }

  add(obj : receipt_order )  {
    let user_fk= this.userService.Login_User.user_seq;
    return this.httpClient.post(this.RestUrl +"Receipt_Order/add/"+user_fk,obj,this.httpOptions);  
  }

  update(obj : receipt_order )  {
    let user_fk= this.userService.Login_User.user_seq;
    return this.httpClient.put(this.RestUrl +"Receipt_Order/update/"+user_fk,obj,this.httpOptions);  
  }

  search(req : any )  {
    return this.httpClient.post(this.RestUrl +"Receipt_Order/Search",req,this.httpOptions);  
  }

  getById(id: number){
    return this.httpClient.get(this.RestUrl +"Receipt_Order/GetByID/"+id,this.httpOptions) as Observable<receipt_order>;  
    
  }

  getBySeq(seq: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +"Receipt_Order/GetBySeq/"+seq) as Observable<result>;      
  }

  generate_incumbent_id(incumbent_id_generate_type_fk: number,month: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +`Receipt_Order/generate_incumbent_id/${incumbent_id_generate_type_fk}/${month}`,this.httpOptions) as Observable<result>;      
  }


  generate_document_id(incumbent_id_generate_type_fk: number,month: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +`Receipt_Order/generate_document_id/${incumbent_id_generate_type_fk}/${month}`,this.httpOptions) as Observable<result>;      
  }
  
  export2Excel() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
      return this.httpClient.post<any>( this.RestUrl +'Receipt_Order/ExportExcel', this.httpOptions,
          {headers: headers, responseType: 'blob' as 'json' }
        );
  }


}
