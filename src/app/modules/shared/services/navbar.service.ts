import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  isHeaderAnchClicked: boolean= false;
  constructor() { }

  onNavbarVisit(){
    this.isHeaderAnchClicked= false;
  }
}
