import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './modules/shared/components/containers';
import { LoginComponent } from './modules/shared/components/login/login.component';
import { AuthGuardServiceService } from './modules/shared/services/auth-guard-service.service';


const routes: Routes = [
 
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
  
  { path: 'sanadKid',
  //  canActivate: [AuthGuardServiceService],
   loadChildren: () => import('./modules/sanad-kid/sanad-kid.module').then(m => m.SanadKidModule) },
  { path: 'tree', loadChildren: () => import('./modules/account-tree/account-tree.module').then(m => m.AccountTreeModule) },
  { path: 'codingTable', loadChildren: () => import('./modules/coding-tables/coding-tables.module').then(m => m.CodingTablesModule) },
  { path: 'exchangeOrder', loadChildren: () => import('./modules/exchange-order/exchange-order.module').then(m => m.ExchangeOrderModule) },
  { path: 'paymentOrder', loadChildren: () => import('./modules/payment-order/payment-order.module').then(m => m.PaymentOrderModule) },
  { path: 'receiptOrder', loadChildren: () => import('./modules/receipt-order/receipt-order.module').then(m => m.ReceiptOrderModule) },
  { path: 'mrBook', loadChildren: () => import('./modules/mr-book/mr-book.module').then(m => m.MrBookModule) },
  { path: 'mrBookAccountCenter', loadChildren: () => import('./modules/mr-book-account-center/mr-book-account-center.module').then(m => m.MrBookAccountCenterModule) },
  { path: 'reviewBalance', loadChildren: () => import('./modules/review-balance/review-balance.module').then(m => m.ReviewBalanceModule) },

    ]

  },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  //   data: {
  //     title: 'تسجيل دخول إلى منظومة الشامل'
  //   }
  // }
  // ,
  
  // {
  //   path: '404',
  //   component: Page404Component,
  //   data: {
  //     title: 'Page 404'
  //   }
  // },
  // {
  //   path: '500',
  //   component: Page500Component,
  //   data: {
  //     title: 'Page 500'
  //   }
  // },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'تسجيل الدخول'
    }
  },

  { path: '', redirectTo: '', pathMatch: 'full' },
 
  { path: 'common-module', loadChildren: () => import('./modules/common-module/common-module.module').then(m => m.CommonModuleModule) },
 
 
 
 
 
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
