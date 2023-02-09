import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './modules/shared/components/containers';
// const routes: Routes = [
//   { path: 'sanadKid', loadChildren: () => import('./modules/sanad-kid/sanad-kid.module').then(m => m.SanadKidModule) },
//   { path: 'tree', loadChildren: () => import('./modules/account-tree/account-tree.module').then(m => m.AccountTreeModule) },
//   { path: 'codingTable', loadChildren: () => import('./modules/coding-tables/coding-tables.module').then(m => m.CodingTablesModule) }
// ];

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
  // {
  //   path: 'dashboard',
  //   component:MainComponent
  // },
  { path: 'sanadKid', loadChildren: () => import('./modules/sanad-kid/sanad-kid.module').then(m => m.SanadKidModule) },
  { path: 'tree', loadChildren: () => import('./modules/account-tree/account-tree.module').then(m => m.AccountTreeModule) },
  { path: 'codingTable', loadChildren: () => import('./modules/coding-tables/coding-tables.module').then(m => m.CodingTablesModule) },
  { path: 'exchangeOrder', loadChildren: () => import('./modules/exchange-order/exchange-order.module').then(m => m.ExchangeOrderModule) },

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

  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
