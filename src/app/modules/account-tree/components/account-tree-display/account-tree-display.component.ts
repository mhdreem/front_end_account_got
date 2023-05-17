import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Observable, Subscription, combineLatest, forkJoin, of } from 'rxjs';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { PageTreeServiceService } from '../page_service/page-tree-service.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

interface extende_accounts_tree extends accounts_tree {
  expandable?: boolean
}


@Component({
  selector: 'app-account-tree-display',
  templateUrl: './account-tree-display.component.html',
  styleUrls: ['./account-tree-display.component.scss']
})
export class AccountTreeDisplayComponent {
  @ViewChild("btn_update") btn_update: ElementRef;

  SelectedParent: any;
  Root: accounts_tree;

  @Input() Title: string = '';
  @Output() OnSelectParentSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnEditSelect: EventEmitter<any> = new EventEmitter<any>();

  _Subscriptions: Subscription[] = [];


  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };


  LoadingFinish: boolean;


  treeDataSource = new MatTreeNestedDataSource<extende_accounts_tree>();
  treeControl = new NestedTreeControl<extende_accounts_tree>(node => node.children);
  isExpandable = (node: extende_accounts_tree) => node.expandable;

  hasChild = (_: number, node: extende_accounts_tree) => !!node.children && node.children.length > 0;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private modalService: NgbModal,
    private accountTreeService: AccountTreeService) {
    this.LoadingFinish = true;
    this.Load_Data();
  }


  Load_Data() {
    this.LoadingFinish = false;
    var Subscription = forkJoin(
      this.BuildTree()
    ).subscribe(
      res => {
        this.Root = res[0];
console.log('this.Root', this.Root);
        this.LoadingFinish = true;
      }
    )
    this._Subscriptions.push(Subscription);
  }



  ngOnDestroy(): void {
    if (this._Subscriptions != null && this._Subscriptions.length > 0) {
      this._Subscriptions.forEach(Subscription => {
        Subscription.unsubscribe();
      });
    }

  }

  BuildTree(): Observable<extende_accounts_tree> {
    return this.accountTreeService.BuildTree();
  }

  ReBuildTree() {
    this.accountTreeService.BuildTree().subscribe(
      res => {
        if (res != null)
          this.Root = res;
      }
    )
  }



  openBasicModal(content: TemplateRef<any>) {

    this.modalService.open(content, { windowClass: 'sidepanel sidepanel-fade', size: 'side-70', backdropClass: 'light-blue-backdrop' }).result.then((Result) => {

      if (Result == 1 && this.SelectedParent != null) {

        this.OnEditSelect.emit(this.SelectedParent);
      }
      else if (Result == 2 && this.SelectedParent != null) {
        this.OnSelectParentSelect.emit(this.SelectedParent);
      } else
        this.OnSelectParentSelect.emit({});


    }).catch(() => {

    });
  }



  SelectAccountTree(node: extende_accounts_tree) {
    this.SelectedParent = node;
    var btn_update = document.getElementById("btn_update");
    if (btn_update!= null)
    {
        btn_update.click();
    }

    /*
   if (this.btn_update!= null && this.btn_update.nativeElement!= null )
   {
    this.btn_update.nativeElement.click();
   }
   */

  }



  Children(): any[] {
    if (this.Root != null && this.Root.children != null && this.Root.children.length > 0)
      return this.Root.children;
    return [];
  }

}
