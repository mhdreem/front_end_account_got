import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent, INavData } from '@coreui/angular';
import { NavbarService } from 'src/app/modules/shared/services/navbar.service';
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
    private navbarService: NavbarService
    ) {
    super();
  }
  ngOnInit(): void {
    
  }
  Logout()
  {
     // this.userservice.();
  }

  treeAnchorClicked(){
    this.navItems = [
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
    this.navService.navItems_Subject.next(this.navItems);
  }

  sanadAnchorClicked(){
    this.navItems = [
      {
        name: 'سند القيد',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'عرض سندات القيد' ,
        url: 'sanadKid/module/sanadKid',
        iconComponent: { name: 'cil-pencil' },
    
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);

  }

  exchangeAnchorClicked(){
    this.navItems = [
      {
        name: 'أمر الصرف',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'عرض أوامر الصرف' ,
        url: 'exchangeOrder/module/exchangeOrder',
        iconComponent: { name: 'cil-pencil' },
    
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);

  }
  
  paymentAnchorClicked(){
    this.navItems = [
      {
        name: 'أمر الدفع',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'عرض أوامر الدفع' ,
        url: 'paymentOrder/module/paymentOrder',
        iconComponent: { name: 'cil-pencil' },
    
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);

  }
  
  receiptAnchorClicked(){
    this.navItems = [
      {
        name: 'أمر القبض',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'عرض أوامر القبض' ,
        url: 'receiptOrder/module/receiptOrder',
        iconComponent: { name: 'cil-pencil' },
    
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);

  }
  
  mrBookAnchorClicked(){
    this.navItems = [
      {
        name: 'دفتر الأستاذ',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'عرض دفتر الأستاذ' ,
        url: 'mrBook/module/mrBook',
        iconComponent: { name: 'cil-pencil' },
    
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);

  }
  
  mrBookAccountCenterAnchorClicked(){
    this.navItems = [
      {
        name: 'دفتر الأستاذ مركز الكلفة',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'عرض دفتر الأستاذ مركز الكلفة' ,
        url: 'mrBookAccountCenter/module/mrBookAccountCenter',
        iconComponent: { name: 'cil-pencil' },
    
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);

  }
  
  reviewBalanceAnchorClicked(){
    this.navItems = [
      {
        name: 'ميزان المراجعة',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'عرض ميزان المراجعة' ,
        url: 'reviewBalance/module/reviewBalance',
        iconComponent: { name: 'cil-pencil' },
    
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);

  }

  accountCenterAnchorClicked(){
    this.navItems = [
      {
        name: 'مراكز الكلفة',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'عرض مراكز الكلفة' ,
        url: 'accountCenters/module/accountCenters',
        iconComponent: { name: 'cil-pencil' },
    
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);
  }

  tableAnchorClicked(){
    this.navItems = [
      {
        name: 'جداول التراميز',
        url: '/',
        // iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'مركز الكلفة' ,
        url: 'codingTable/module/accountCenter',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'الفرع' ,
        url: 'codingTable/module/branch',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'القسم' ,
        url: 'codingTable/module/department',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'المستخدم' ,
        url: 'codingTable/module/user',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'القائمة المالية' ,
        url: 'codingTable/module/finanaceList',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'تصنيف الحساب' ,
        url: 'codingTable/module/class',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'الحساب الختامي' ,
        url: 'codingTable/module/accountFinal',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'مجموعة الحسابات' ,
        url: 'codingTable/module/group',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'مستوى الحساب' ,
        url: 'codingTable/module/level',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'نوع الحساب' ,
        url: 'codingTable/module/type',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'مرحلة سند القيد' ,
        url: 'codingTable/module/sanadKidStage',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'مرحلة أمر الصرف' ,
        url: 'codingTable/module/exchangeOrderStage',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'مرحلة أمر الدفع' ,
        url: 'codingTable/module/paymentOrderStage',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'مرحلة أمر القبض' ,
        url: 'codingTable/module/receiptOrderStage',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'نوع المرفق' ,
        url: 'codingTable/module/attachmentType',
        iconComponent: { name: 'cil-pencil' },
      },
      {
        name: 'دفتر سند القيد' ,
        url: 'codingTable/module/sanadKidBook',
        iconComponent: { name: 'cil-pencil' },
      },
    ];
    this.navService.navItems_Subject.next(this.navItems);

  }
  
  showSideBar(){
    // document.getElementById('menu')?.click();
    document.querySelector('c-sidebar')?.classList.remove('hide');
    document.querySelector('c-sidebar')?.classList.add('headerAnchorClicked');
    this.navbarService.isHeaderAnchClicked= true;
    // document.querySelector('c-sidebar')?.classList.remove('hide');
  }
}
