import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { sanad_kid } from '../../shared/models/sanad-kid';

@Injectable({
  providedIn: 'root'
})
export class PageSanadKidService {

  public sanad_kid : sanad_kid;
  public $sanad_kid : BehaviorSubject<sanad_kid> ;


  
  constructor() { 
    this.sanad_kid = {};
    this.sanad_kid.sanad_kid_details=[];
    this.$sanad_kid  = new  BehaviorSubject<sanad_kid>({});
  }

  new()
  {
    this.sanad_kid = {};
    this.sanad_kid.sanad_kid_details=[];
    this.$sanad_kid.next(this.sanad_kid);
  } 

  set(sanad_kid:sanad_kid)
  {
    this.sanad_kid = sanad_kid;
    this.$sanad_kid.next( this.sanad_kid);
  } 

}
