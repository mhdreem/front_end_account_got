import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanadKidEditComponent } from './components/sanad-kid-edit/sanad-kid-edit.component';
import { SanadKidListComponent } from './components/sanad-kid-list/sanad-kid-list.component';
import { SanadKidComponent } from './sanad-kid.component';

const routes: Routes = [
  {
    path: 'list', component: SanadKidListComponent,
    data:
    {
      title: 'عرض سندات القيد'
    }
  },
  {
    path: 'edit', component: SanadKidEditComponent,
    data:
    {
      title: 'تعديل سند القيد'
    }
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanadKidRoutingModule { }
