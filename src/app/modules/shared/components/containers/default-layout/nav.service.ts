import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavService {

  public navItems: INavData[] = [

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
      url: 'tree/list',
      iconComponent: { name: 'cilOptions' }

    }
    ,
    {
      name: 'سند القيد',
      iconComponent: { name: 'cilOptions' },
      url: 'sanadKid/list',

    },
    {
      name: 'أمر الصرف',
      iconComponent: { name: 'cilOptions' },
      url: 'exchangeOrder/list',

    },
    {
      name: 'أمر الدفع',
      iconComponent: { name: 'cil-pencil' },
      url: 'paymentOrder/list',

    },
    {
      name: 'أمر القبض',
      iconComponent: { name: 'cil-pencil' },
      url: 'receiptOrder/list',

    },
    {
      name: 'دفتر الأستاذ',
      iconComponent: { name: 'cil-pencil' },
      url: 'mrBook/list',

    },

    {
      name: ' دفتر الأستاذ مركز الكلفة',
      iconComponent: { name: 'cil-pencil' },
      url: 'mrBookAccountCenter/list',

    },


    {
      name: 'قوائم فرعية',
      url: 'codingTable/module/subfinanciallist',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مركز الكلفة',
      url: 'codingTable/module/accountCenter',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'الفرع',
      url: 'codingTable/module/branch',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'القسم',
      url: 'codingTable/module/department',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'المستخدم',
      url: 'codingTable/module/user',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'القائمة المالية',
      url: 'codingTable/module/finanaceList',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'صنف الحساب',
      url: 'codingTable/module/class',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'تصنيف الحساب',
      url: 'codingTable/module/classification',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'نوع المستفيد',
      url: 'codingTable/module/beneficiaryType',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'الحساب الختامي',
      url: 'codingTable/module/accountFinal',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مجموعة الحسابات',
      url: 'codingTable/module/group',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مستوى الحساب',
      url: 'codingTable/module/level',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'نوع الحساب',
      url: 'codingTable/module/type',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مرحلة سند القيد',
      url: 'codingTable/module/sanadKidStage',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مرحلة أمر الصرف',
      url: 'codingTable/module/exchangeOrderStage',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مرحلة أمر الدفع',
      url: 'codingTable/module/paymentOrderStage',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مرحلة أمر القبض',
      url: 'codingTable/module/receiptOrderStage',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'نوع المرفق',
      url: 'codingTable/module/attachmentType',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'دفتر سند القيد',
      url: 'codingTable/module/sanadKidBook',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'صناديق المؤسسة',
      url: 'codingTable/module/paymentsafe',
      iconComponent: { name: 'cil-pencil' },
    }


  ];

  public navItems_Subject: BehaviorSubject<INavData[]> = new BehaviorSubject<INavData[]>(this.navItems);

  constructor() {
    this.navItems_Subject.subscribe(

    )

  }


  ChangeNav(nav: INavData[]) {
    this.navItems_Subject.next(nav);
    this.navItems = nav;
  }
}
