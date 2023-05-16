import { Component, OnDestroy, OnInit } from '@angular/core';

import { navItems } from './_nav';
import { NavService } from './nav.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {

  public navItems = navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(private NavService:NavService) {}

  ngOnInit(): void {
   this.navItems = this.NavService.navItems;
  }

  
  ngOnDestroy(): void {
  
  }
}
