import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
<<<<<<< Updated upstream
import { sanad_kid_book } from '../models/sanad_kid_book';
=======
import { SanadKidBook } from '../models/sanad-kid-book';
>>>>>>> Stashed changes
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
<<<<<<< Updated upstream
export class SanadKidBookService extends BaseAPIService{

  public List_sanad_kid_book:sanad_kid_book[] = [];
  public List_sanad_kid_book_BehaviorSubject:BehaviorSubject<sanad_kid_book[]> = new BehaviorSubject<sanad_kid_book[]>([]);
  

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  list() :Observable<sanad_kid_book[]> {
    return this.httpClient.get<sanad_kid_book[]>(this.RestUrl +"Sanad_Kid_Book/list",this.httpOptions) ;      
  }


  fill()  {
    this.Subscription =  this.httpClient.get<sanad_kid_book[]>(this.RestUrl +"Sanad_Kid_Book/list",this.httpOptions) .subscribe    (
      data=>
      {
        this.List_sanad_kid_book = data;
        this.List_sanad_kid_book_BehaviorSubject.next(this.List_sanad_kid_book);
      }
     )    
  }

  delete(id:number )  {  
    return this.httpClient.delete(this.RestUrl +"Sanad_Kid_Book/delete/"+id);  
  }

  add(obj : sanad_kid_book )  {    
    return this.httpClient.post(this.RestUrl +"Sanad_Kid_Book/add",obj,this.httpOptions);  
  }

  update(obj : sanad_kid_book )  {   
    return this.httpClient.put(this.RestUrl +"Sanad_Kid_Book/update",this.httpOptions);  
  }

  validate_name(obj: sanad_kid_book) {
    return this.httpClient.post(this.RestUrl + "Sanad_Kid_Book/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Sanad_Kid_Book/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Sanad_Kid_Book/importExcel",formData);
  }
}
=======
export class SanadKidBookService  extends BaseAPIService{

  public List_SanadKidBook: SanadKidBook[] = [];

  public List_SanadKidBook_BehaviorSubject: BehaviorSubject<SanadKidBook[]> = new BehaviorSubject<SanadKidBook[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list(): Observable<SanadKidBook[]> {
    return this.httpClient.get<SanadKidBook[]>(this.RestUrl + "Sanad_Kid_Book/list", this.httpOptions);

  }


  fill() {

    this.Subscription.add(this.httpClient.get<SanadKidBook[]>(this.RestUrl + "Sanad_Kid_Book/list", this.httpOptions).subscribe(
      data => {
        this.List_SanadKidBook = data;
        this.List_SanadKidBook_BehaviorSubject.next(this.List_SanadKidBook);
      }
    ))

  }

  delete(id: number) {
    return this.httpClient.delete(this.RestUrl + "Sanad_Kid_Book/delete/" + id, this.httpOptions);
  }

  add(obj: SanadKidBook) {
    return this.httpClient.post(this.RestUrl + "Sanad_Kid_Book/add", obj, this.httpOptions);
  }

  update(obj: SanadKidBook) {
    return this.httpClient.put(this.RestUrl + "Sanad_Kid_Book/update", obj, this.httpOptions);
  }

  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Sanad_Kid_Book/OrderRow", req, this.httpOptions);
  }

  getDefault(): Observable<SanadKidBook[]> {
    return this.httpClient.get<SanadKidBook[]>(this.RestUrl + "Sanad_Kid_Book/GetDefault", this.httpOptions);

  }
}
>>>>>>> Stashed changes
