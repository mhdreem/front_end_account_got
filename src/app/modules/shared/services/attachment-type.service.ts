import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { attachement_type } from '../models/attachement_type';
import { BaseAPIService } from './base/base-api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachmentTypeService extends BaseAPIService{

  public List_attachment_type:attachement_type[] = [];
  public List_attachment_type_BehaviorSubject:BehaviorSubject<attachement_type[]> = new BehaviorSubject<attachement_type[]>([]);
  

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  list() :Observable<attachement_type[]> {
    return this.httpClient.get<attachement_type[]>(this.RestUrl +"Attachement_Type/list",this.httpOptions) ;      
  }


  fill()  {
    this.Subscription =  this.httpClient.get<attachement_type[]>(this.RestUrl +"Attachement_Type/list",this.httpOptions) .subscribe    (
      data=>
      {
        this.List_attachment_type = data;
        this.List_attachment_type_BehaviorSubject.next(this.List_attachment_type);
      }
     )    
  }

  delete(id:number )  {  
    return this.httpClient.delete(this.RestUrl +"Attachement_Type/delete/"+id);  
  }

  add(obj : attachement_type )  {    
    return this.httpClient.post(this.RestUrl +"Attachement_Type/add",obj,this.httpOptions);  
  }

  update(obj : attachement_type )  {   
    return this.httpClient.put(this.RestUrl +"Attachement_Type/update",this.httpOptions);  
  }

  validate_name(obj: attachement_type) {
    return this.httpClient.post(this.RestUrl + "Attachement_Type/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Attachement_Type/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Attachement_Type/importExcel",formData);
  }
}
