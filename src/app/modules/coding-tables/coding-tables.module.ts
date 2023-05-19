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
import { SanadKidBookListComponent } from './components/sanad-kid-book/sanad-kid-book-list/sanad-kid-book-list.component';
import { SanadKidBookAddComponent } from './components/sanad-kid-book/sanad-kid-book-add/sanad-kid-book-add.component';
import { CommonModuleModule } from '../common-module/common-module.module';
import { SanadKidStageListComponent } from './components/sanad-kid-stage/sanad-kid-stage-list/sanad-kid-stage-list.component';
import { SanadKidStageAddComponent } from './components/sanad-kid-stage/sanad-kid-stage-add/sanad-kid-stage-add.component';
import {PaymentOrderStageListComponent} from './components/payment-order-stage/payment-order-stage-list/payment-order-stage-list.component'
import {PaymentOrderStageAddComponent} from './components/payment-order-stage/payment-order-stage-add/payment-order-stage-add.component'
import {ReceiptOrderStageListComponent} from './components/receipt-order-stage/receipt-order-stage-list/receipt-order-stage-list.component'
import {ReceiptOrderStageAddComponent} from './components/receipt-order-stage/receipt-order-stage-add/receipt-order-stage-add.component'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PaymentSafeListComponent } from './components/payment_safe/payment_safe-list/payment_safe-list.component';
import { PaymentSafeAddComponent } from './components/payment_safe/payment_safe-add/payment_safe-add.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconModule, IconSetService  } from '@coreui/icons-angular';
import { SubFinancialListAddComponent } from './components/sub-financial-list/sub-financial-list-add/sub-financial-list-add.component';
import { SubFinancialListComponent } from './components/sub-financial-list/sub-financial-list-list/sub-financial-list-list.component';
import { AccountClassificationListComponent } from './components/account-classification/account-classification-list/account-classification-list.component';
import { AccountClassificationAddComponent } from './components/account-classification/account-classification-add/account-classification-add.component';
import { BeneficiaryTypeListComponent } from './components/beneficiary-Type/beneficiary-type-list/beneficiary-type-list.component';
import { BeneficiaryTypeEditComponent } from './components/beneficiary-Type/beneficiary-type-edit/beneficiary-type-edit.component';

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
  MatCheckboxModule,
  MatProgressBarModule
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
    SanadKidBookListComponent,
    SanadKidBookAddComponent,
    SanadKidStageListComponent,
    SanadKidStageAddComponent,
    PaymentOrderStageListComponent,
    PaymentOrderStageAddComponent,
    ReceiptOrderStageListComponent,
    ReceiptOrderStageAddComponent,
    PaymentSafeAddComponent,
    PaymentSafeListComponent,
    SubFinancialListAddComponent,
    SubFinancialListComponent,
    AccountClassificationListComponent,
    AccountClassificationAddComponent,
    BeneficiaryTypeListComponent,
    BeneficiaryTypeEditComponent
  ],
  imports: [
    CommonModule,
    CodingTablesRoutingModule,   
    ReactiveFormsModule,
    RouterModule,   
    FormsModule,
    Import_Corui,
    Import_Materail,
    CommonModuleModule,
    NgSelectModule,
    IconModule,
    
  ],
  providers:[
    IconSetService
  ]
})
export class CodingTablesModule { }
