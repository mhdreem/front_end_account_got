import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavService {
  
  public  navItems: INavData[] = [

    {
      name: 'مؤسسة التبغ',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }    
    },
    {
      name: 'شجرة الحسابات',
      url: 'tree/module',
      iconComponent: { name: 'cil-pencil' }
      
    }
    ,
    {
      name: 'سند القيد',
      iconComponent: { name: 'cil-pencil' },
      url: 'sanadKid/module',
  
    },  
    {
      name: 'أمر الصرف',
      iconComponent: { name: 'cil-pencil' },
      url: 'exchangeOrder/module',
  
    },  
    {
      name: 'جداول الترميز',
      url: 'codingTable/module',
      iconComponent: { name: 'cil-pencil' },
    },
  ];

  public navItems_Subject : BehaviorSubject< INavData[]>= new BehaviorSubject< INavData[]>(this.navItems);

  constructor() { 
    this.navItems_Subject.subscribe(

    )

  }


  ChangeNav(nav:INavData[])
  {
    this.navItems_Subject.next(nav);
    this.navItems = nav;
  }
}
