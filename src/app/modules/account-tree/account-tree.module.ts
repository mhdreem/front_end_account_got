import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountTreeRoutingModule } from './account-tree-routing.module';
import { AccountTreeComponent } from './account-tree.component';
import { AccountTreeListComponent } from './components/account-tree-list/account-tree-list.component';
import { AccountTreeEditComponent } from './components/account-tree-edit/account-tree-edit.component';

import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTreeModule} from '@angular/material/tree';
import {MatMenuModule} from '@angular/material/menu';
import { CommonModuleModule } from '../common-module/common-module.module';
import { GridModule } from '@coreui/angular';
import { AccountTreeListSearchComponent } from './components/account-tree-list-search/account-tree-list-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewsModule } from '../views/views.module';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AccountTreeDisplayComponent } from './components/account-tree-display/account-tree-display.component';
import { TreeviewComponent } from './components/treeview/treeview.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AsdasdComponent } from './components/asdasd/asdasd.component';
import {MatExpansionModule} from '@angular/material/expansion'; 

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AccountTreeComponent,
    AccountTreeListComponent,
    AccountTreeEditComponent,
    AccountTreeListSearchComponent,
    AccountTreeDisplayComponent,
    TreeviewComponent,
    AsdasdComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    PerfectScrollbarModule,
    AccountTreeRoutingModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTreeModule,
    MatMenuModule,
    CommonModuleModule,
    GridModule,
    NgSelectModule,
    NgbModule ,    
    ViewsModule,
    
    FontAwesomeModule
  ],
  providers: [
  
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  
  ],
})
export class AccountTreeModule { }
