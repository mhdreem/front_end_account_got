import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';

@Injectable({
  providedIn: 'root'
})
export class ReturnBtnService {

  navItems: INavData[] = [];
  returnUrl: string= '';
  constructor() { }
}
