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


@NgModule({
  declarations: [
    AccountTreeComponent,
    AccountTreeListComponent,
    AccountTreeEditComponent
  ],
  imports: [
    CommonModule,
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
    GridModule
  ]
})
export class AccountTreeModule { }
