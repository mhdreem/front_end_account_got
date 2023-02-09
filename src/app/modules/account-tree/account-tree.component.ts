import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../shared/services/return-btn.service';

@Component({
  selector: 'app-account-tree',
  templateUrl: './account-tree.component.html',
  styleUrls: ['./account-tree.component.scss']
})
export class AccountTreeComponent implements OnInit {

  navItems: INavData[] = [

    {
      name: 'شجرة الحسابات',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },

    {
      name: 'عرض شجرة الحسابات' ,
      url: 'tree/module/accountTree',
      iconComponent: { name: 'cil-pencil' },
  
    },
    
  ];

  constructor(private navService:NavService,
    private returnBtnService: ReturnBtnService) {
      this.navService.navItems_Subject.next(this.navItems);
    // this.returnBtnService.navItems= this.returnNavItems;
     }

  ngOnInit(): void {
    this.navService.navItems_Subject.next(this.navItems);

  }

}
