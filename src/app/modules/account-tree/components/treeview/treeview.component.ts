import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent implements OnInit, OnChanges {

  @Input() root: accounts_tree;

  isCollapsed = false;




  @Output()
  OnSelect = new EventEmitter<accounts_tree>();

  HasChildren(): boolean {
    if (this.root != null && this.root.children != null && this.root.children.length > 0)
      return true;
    return false;
  }



  Children(): any[] {
    if (this.root != null && this.root.children != null && this.root.children.length > 0)
      return this.root.children;
    return [];
  }


  constructor(
  ) {
  }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['root'] != null
    )
      this.root = changes['root'].currentValue;
  }

  FireSelectEvent() {
    this.isCollapsed = !this.isCollapsed;
    if (this.root != null)
      this.OnSelect.emit(this.root);
  }


  OnSelectItem($event: any) {
    if ($event != null)
      this.OnSelect.emit($event);
  }


}
