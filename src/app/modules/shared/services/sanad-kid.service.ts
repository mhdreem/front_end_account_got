import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { sanad_kid } from '../models/sanad-kid';
import { BaseAPIService } from './base/base-api.service';
import { UserService } from './user.service';
import { result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class SanadKidService extends BaseAPIService{

  public List_SanadKid:sanad_kid[] = [];

  public List_SanadKid_BehaviorSubject:BehaviorSubject<sanad_kid[]> = new BehaviorSubject<sanad_kid[]>([]);
 
  constructor(protected override httpClient : HttpClient,
    private userService :UserService) {
      super(httpClient)
     }

  list()  {
    return this.httpClient.get(this.RestUrl +"Sanad_Kid/list",this.httpOptions) as Observable<sanad_kid[]>;  
    
  }


  fill()  {
     this.httpClient.get<sanad_kid[]>(this.RestUrl +"Sanad_Kid/list",this.httpOptions) .subscribe    (
      data=>
      {
        this.List_SanadKid = data;
        this.List_SanadKid_BehaviorSubject.next(this.List_SanadKid);
      }
     )
    
  }

  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"Sanad_Kid/delete/"+id,this.httpOptions);  
  }

  add(obj : sanad_kid )  {
    let user_fk= this.userService.Login_User.user_seq;
    return this.httpClient.post(this.RestUrl +"Sanad_Kid/add/"+user_fk,obj,this.httpOptions);  
  }

  update(obj : sanad_kid )  {
    let user_fk= this.userService.Login_User.user_seq;
    return this.httpClient.put(this.RestUrl +"Sanad_Kid/update/"+user_fk,obj,this.httpOptions);  
  }

  search(req : any ) :Observable<any[]> {
    return this.httpClient.post<any[]>(this.RestUrl +"Sanad_Kid/Search",req,this.httpOptions);  
  }

  getById(id: number){
    return this.httpClient.get(this.RestUrl +"Sanad_Kid/GetByID/"+id,this.httpOptions) as Observable<sanad_kid>;      
  }

  getBySeq(seq: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +"Sanad_Kid/GetBySeq/"+seq,this.httpOptions) as Observable<result>;      
  }

  
  getByOperationCode(operation_code_fk: number,operation_type_fk:number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +`Sanad_Kid/getByOperationCode/${operation_code_fk}/${operation_type_fk}`,this.httpOptions) as Observable<result>;      
  }

  generate_incumbent_id(incumbent_id_generate_type_fk: number,month: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +`Sanad_Kid/generate_incumbent_id/${incumbent_id_generate_type_fk}/${month}`,this.httpOptions) as Observable<result>;      
  }


  generate_document_id(incumbent_id_generate_type_fk: number,month: number):Observable<result>{
    return this.httpClient.get<result>(this.RestUrl +`Sanad_Kid/generate_document_id/${incumbent_id_generate_type_fk}/${month}`,this.httpOptions) as Observable<result>;      
  }

  export2Excel() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
      return this.httpClient.post<any>( this.RestUrl +'ExportExcel', this.httpOptions,
          {headers: headers, responseType: 'blob' as 'json' }
        );
  }
}
