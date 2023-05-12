import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountCentersRoutingModule } from './account-centers-routing.module';
import { AccountCentersComponent } from './account-centers.component';
import { AccountCentersViewComponent } from './components/account-centers-view/account-centers-view.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { GridModule } from '@coreui/angular';
import { CardModule } from '@coreui/angular';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatPaginatorModule} from '@angular/material/paginator';


const Import_Corui = [
  GridModule,
  CardModule
];

@NgModule({
  declarations: [
    AccountCentersComponent,
    AccountCentersViewComponent
  ],
  imports: [
    CommonModule,
    AccountCentersRoutingModule,
    MatToolbarModule,
    MatIconModule,
    Import_Corui,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule

  ]
})
export class AccountCentersModule { }
