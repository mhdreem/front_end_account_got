import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTreeServiceService } from '../page_service/page-tree-service.service';

@Component({
  selector: 'app-account-tree-list',
  templateUrl: './account-tree-list.component.html',
  styleUrls: ['./account-tree-list.component.scss']
})
export class AccountTreeListComponent implements OnInit, OnDestroy {

  Request: any = {};

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 123) {
      event.preventDefault();
      this.add();
    }
    if (event.keyCode == 119) {
      event.preventDefault();
      this.View();
    }
    if (event.keyCode == 118) {
      event.preventDefault();
      this.exportToExcel();
    }
  }


  LoadingFinish: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<accounts_tree>();
  displayedColumns: string[] = [
   'balance_debtor','balance_creditor', 'total',
   'general',
   'assistant',
   'sub',
   'partial',
   'analytical', 'account_name', 'account_center_name', 'account_class_name', 'account_final_name', 'account_group_name', 'account_level_name', 'finance_list_name', 'mobil', 'phone', 'fax', 'address', 'notice', 'action'];
  dataSourceIsEmpty: boolean = true;

  _Subscriptions: Subscription[] = [];


  isLoading = false;

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isDataSourceLoading: boolean = false;

  // darkTheme: boolean;


  constructor(
    private PageTreeServiceService: PageTreeServiceService,
    private ActivatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private accountTreeService: AccountTreeService,
    private router: Router
  ) {
    this.LoadingFinish = true;

   
  }
 

  ngOnInit(): void {
    

  }
  
  applyFilter(event: Event) {
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm:any, key:any) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();
  }

  nestedFilterCheck(search:any, data:any, key:any) {
    if (typeof data[key] === 'object') {
      
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += ''+ data[key];
    }
    return search;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this._Subscriptions != null &&
      this._Subscriptions.length > 0) {
      this._Subscriptions.forEach(Sub => {
        Sub.unsubscribe();
      });
    }
  }


  OnSeachCommandExecute(Request: any) {
    var Subscription =
      this.accountTreeService.search(Request).subscribe
        (data => {
          if (data != null && data.value != null && data.total_row_count >= 0) {
            this.totalRows = data.total_row_count;

            this.totalRows = this.totalRows;
            this.dataSource = new MatTableDataSource(data.value);
            this.isDataSourceLoading = false;
            if (data.value?.length != 0)
              this.dataSourceIsEmpty = false;
          }
        }

        );
    this._Subscriptions.push(Subscription);
  }

  View() {

    this.isDataSourceLoading = true;

    if (this.Request != null) {

      this.Request.page_index = this.currentPage;
      this.Request.row_count = this.pageSize;
    }else
    {
      this.Request ={
        page_index: this.currentPage,
        row_count: this.pageSize
      }
    }


    var Subscription =
      this.accountTreeService.search(this.Request).subscribe
        (data => {
          if (data != null && data.value != null && data.total_row_count >= 0) {
            this.totalRows = data.total_row_count;

            this.totalRows = this.totalRows;
            this.dataSource = new MatTableDataSource(data.value);
            this.isDataSourceLoading = false;
            if (data.value?.length != 0)
              this.dataSourceIsEmpty = false;
          }
        }

        );
    this._Subscriptions.push(Subscription);
  }


  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  clearDataSource() {
    this.dataSource.data = [];
  }

  exportToExcel() {

  }

  Delete(account: accounts_tree) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.accountTreeService.delete(account.seq!).subscribe(() => {
          this.snackBar.open('تم الحذف بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        })
      }
    });
  }

  Update(account: accounts_tree) {
    this.PageTreeServiceService.$account_tree.next(account);
    this.PageTreeServiceService.$parent_account_tree.next({});
    this.router.navigate(['/tree/edit'], { relativeTo: this.ActivatedRoute });
  }

  add() {
    this.PageTreeServiceService.$account_tree.next({});
    this.PageTreeServiceService.$parent_account_tree.next({});

    this.router.navigate(['/tree/edit'], { relativeTo: this.ActivatedRoute });


  }


  OnPage($event:any)
  {

    console.log($event);
    if ($event.pageIndex!= null && $event.pageIndex>=0)
      this.currentPage = $event.pageIndex+1;


      if ($event.pageIndex!= null && $event.pageSize>0)
    this.pageSize = $event.pageSize;


      this.View();

  }

}



