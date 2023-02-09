import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountCenterListComponent} from './components/account-center/account-center-list/account-center-list.component'
import {AccountCenterAddComponent} from './components/account-center/account-center-add/account-center-add.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BranchAddComponent } from './components/branch/branch-add/branch-add.component';
import { BranchListComponent } from './components/branch/branch-list/branch-list.component';
import { DepartmentAddComponent } from './components/department/department-add/department-add.component';
import { DepartmentListComponent } from './components/department/department-list/department-list.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { GridModule } from '@coreui/angular';
import { CodingTablesComponent } from './coding-tables.component';
import { CodingTablesRoutingModule } from './coding-tables-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card'; 
import {MatExpansionModule} from '@angular/material/expansion'; 
import {MatIconModule} from '@angular/material/icon'; 
import { MatTableModule } from '@angular/material/table';
import { AccountClassAddComponent } from './components/account-class/account-class-add/account-class-add.component';
import { AccountClassListComponent } from './components/account-class/account-class-list/account-class-list.component';
import { AccountFinalAddComponent } from './components/account-final/account-final-add/account-final-add.component';
import { AccountFinalListComponent } from './components/account-final/account-final-list/account-final-list.component';
import { AccountGroupAddComponent } from './components/account-group/account-group-add/account-group-add.component';
import { AccountGroupListComponent } from './components/account-group/account-group-list/account-group-list.component';
import { AccountLevelAddComponent } from './components/account-level/account-level-add/account-level-add.component';
import { AccountLevelListComponent } from './components/account-level/account-level-list/account-level-list.component';
import { AccountTypeAddComponent } from './components/account-type/account-type-add/account-type-add.component';
import { AccountTypeListComponent } from './components/account-type/account-type-list/account-type-list.component';
import { FinanceListAddComponent } from './components/finance-list/finance-list-add/finance-list-add.component';
import { FinanceListListComponent } from './components/finance-list/finance-list-list/finance-list-list.component';
import { ExchangeOrderStageAddComponent } from './components/exchange-order-stage/exchange-order-stage-add/exchange-order-stage-add.component';
import { ExchangeOrderStageListComponent } from './components/exchange-order-stage/exchange-order-stage-list/exchange-order-stage-list.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AttachmentTypeListComponent } from './components/attachment-type/attachment-type-list/attachment-type-list.component';
import { AttachmentTypeAddComponent } from './components/attachment-type/attachment-type-add/attachment-type-add.component';

const Import_Materail = [
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  FormsModule,
  MatSnackBarModule,
  MatSelectModule,
  MatButtonModule,
  MatTableModule,
  DragDropModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatCardModule,
  MatExpansionModule,
  MatIconModule,
  MatCheckboxModule
];


const Import_Corui = [
  GridModule
];

@NgModule({
  declarations: [
    CodingTablesComponent,
    AccountCenterListComponent,
    AccountCenterAddComponent,
    BranchAddComponent,
    BranchListComponent,
    DepartmentAddComponent,
    DepartmentListComponent,
    UserAddComponent,
    UserListComponent,
    AccountClassAddComponent,
    AccountClassListComponent,
    AccountFinalAddComponent,
    AccountFinalListComponent,
    AccountGroupAddComponent,
    AccountGroupListComponent,
    AccountLevelAddComponent,
    AccountLevelListComponent,
    AccountTypeAddComponent,
    AccountTypeListComponent,
    FinanceListAddComponent,
    FinanceListListComponent,
    ExchangeOrderStageAddComponent,
    ExchangeOrderStageListComponent,
    AttachmentTypeListComponent,
    AttachmentTypeAddComponent,
  ],
  imports: [
    CommonModule,
    CodingTablesRoutingModule,   
    ReactiveFormsModule,
    RouterModule,   
    FormsModule,
    Import_Corui,
    Import_Materail,
    
  ]
})
export class CodingTablesModule { }
