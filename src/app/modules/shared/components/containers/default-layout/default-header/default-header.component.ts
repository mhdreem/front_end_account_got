import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent, INavData } from '@coreui/angular';
import { NavService } from '../nav.service';


@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss']
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  navItems: INavData[];

  // darkTheme: boolean;
  constructor(
    private classToggler: ClassToggleService,
    private navService:NavService,
    ) {
    super();
  }
  ngOnInit(): void {
    
  }
  Logout()
  {
     // this.userservice.();
  }

  anchorClicked(){
    this.navItems = [
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
    this.navService.navItems_Subject.next(this.navItems);
  }

  

  
}
