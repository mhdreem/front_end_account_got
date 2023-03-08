import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewBalanceRoutingModule } from './review-balance-routing.module';
import { ReviewBalanceComponent } from './review-balance.component';

import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModuleModule } from '../common-module/common-module.module';
import { CardModule, GridModule } from '@coreui/angular';
import {MatSelectModule} from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {ReviewBalanceListComponent} from './components/review-balance-list/review-balance-list.component'
import {SelectColumnsComponent} from '../shared/components/select-columns/select-columns.component'

const Import_Corui = [
  GridModule,
  CardModule
];

@NgModule({
  declarations: [
    ReviewBalanceComponent,
    ReviewBalanceListComponent,
    SelectColumnsComponent
  ],
  imports: [
    CommonModule,
    ReviewBalanceRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatMenuModule,
    CommonModuleModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    Import_Corui,
    
  ]
})
export class ReviewBalanceModule { }
