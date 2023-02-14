import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModuleRoutingModule } from './common-module-routing.module';
import { CommonModuleComponent } from './common-module.component';
import {OnlyNumber} from './directives/onlynumber.directive'

@NgModule({
  declarations: [
    CommonModuleComponent,
    OnlyNumber
  ],
  imports: [
    CommonModule,
    CommonModuleRoutingModule
  ],
  exports:
  [OnlyNumber],
})
export class CommonModuleModule { }
