import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MrBookAccountCenterRoutingModule } from './mr-book-account-center-routing.module';
import { MrBookAccountCenterComponent } from './mr-book-account-center.component';
import { MrBookAccountCenterListComponent } from './components/mr-book-account-center-list/mr-book-account-center-list.component';

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

const Import_Corui = [
  GridModule,
  CardModule
];

@NgModule({
  declarations: [
    MrBookAccountCenterComponent,
    MrBookAccountCenterListComponent
  ],
  imports: [
    CommonModule,
    MrBookAccountCenterRoutingModule,
    CommonModuleModule,
    MatMenuModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
    Import_Corui
  ]
})
export class MrBookAccountCenterModule { }
