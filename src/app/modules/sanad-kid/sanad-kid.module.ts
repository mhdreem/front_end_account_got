import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanadKidRoutingModule } from './sanad-kid-routing.module';
import { SanadKidComponent } from './sanad-kid.component';
import { SanadKidListComponent } from './components/sanad-kid-list/sanad-kid-list.component';
import { SanadKidEditComponent } from './components/sanad-kid-edit/sanad-kid-edit.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SanadKidDetailComponent } from './components/sanad-kid-detail/sanad-kid-detail.component';
import { GridModule } from '@coreui/angular';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion'; 
import {MatFormFieldModule} from '@angular/material/form-field';

const Import_Corui = [
  GridModule
];

@NgModule({
  declarations: [
    SanadKidComponent,
    SanadKidListComponent,
    SanadKidEditComponent,
    SanadKidDetailComponent
  ],
  imports: [
    CommonModule,
    SanadKidRoutingModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    Import_Corui
  ]
})
export class SanadKidModule { }