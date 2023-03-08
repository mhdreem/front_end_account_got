import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewBalanceListComponent } from './components/review-balance-list/review-balance-list.component';
import { ReviewBalanceComponent } from './review-balance.component';

const routes: Routes = [
  {
    path: 'module',
    component: ReviewBalanceComponent,
    data:
      {
        title: 'ميزان المراجعة'
      },
      children:[
        {
          path: 'reviewBalance', component: ReviewBalanceListComponent,
          data:
          {
            title: 'عرض ميزان المراجعة'
          }
        },
        
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewBalanceRoutingModule { }
