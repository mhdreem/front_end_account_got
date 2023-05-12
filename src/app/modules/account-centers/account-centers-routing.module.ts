import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountCentersComponent } from './account-centers.component';
import { AccountCentersViewComponent } from './components/account-centers-view/account-centers-view.component';

const routes: Routes = [
  {
    path: 'module',
    component: AccountCentersComponent,
    data:
      {
        title: 'مراكز الكلفة'
      },
      children:[
        {
          path: 'accountCenters', component: AccountCentersViewComponent,
          data:
          {
            title: 'عرض مراكز الكلفة'
          }
        },
        
      ]
    }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountCentersRoutingModule { }
