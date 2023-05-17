import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { branch } from 'src/app/modules/shared/models/branch';
import { exchange_order } from 'src/app/modules/shared/models/exchange_order';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { ExchangeOrderService } from 'src/app/modules/shared/services/exchange-order.service';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { saveAs } from 'file-saver';
import { PageExchangeOrderService } from '../../pageservice/page-exchange-order.service';
import { result } from 'src/app/modules/shared/models/result';

@Component({
  selector: 'app-exchange-order-list',
  templateUrl: './exchange-order-list.component.html',
  styleUrls: ['./exchange-order-list.component.scss']
})


export class ExchangeOrderListComponent implements OnInit, OnDestroy {
  Request: any = {};// Represent Request 
  Subscriptions: Subscription[] = [];

  RowCount: number = 0;
  SumTotal: number = 0;



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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<exchange_order>();
  displayedColumns: string[] =
    ['incumbent_id', 'incumbent_date', 'document_id', 'document_date', 'total_value', 'name_of_owner', 'branch_fk', 'action'];
  dataSourceIsEmpty: boolean = true;



  LoadingFinish: boolean;

  book_list: sanad_kid_book[];
  book_filter: Observable<sanad_kid_book[]>;

  branch_list: branch[];
  branch_filter: Observable<branch[]>;

  _Subscription: Subscription[]=[];



  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean = false;


  selected_order: exchange_order []= [];



  constructor(
    private ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private exchangeOrderService: ExchangeOrderService,
    private PageExchangeOrderService: PageExchangeOrderService,

    private sanadKidBookService: SanadKidBookService,
    private BranchService: BranchService,
  ) {
    this.LoadingFinish = true;


    this.Load_Data();


  }

  ngOnInit(): void {

  }


  ngOnDestroy() {
    this._Subscription.forEach(Sub => {
      if (Sub != null) Sub.unsubscribe();
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    /*
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(()=>{
          this.pageSize = this.paginator.pageSize;
          this.currentPage = this.paginator.pageIndex + 1;
          return this.View();
        })
      )
      .subscribe((data: any) => {
        this.totalRows = data.total_row_count;
        this.dataSource = new MatTableDataSource(data.value);
        this.isLoading= false;
        if (data.value?.length != 0)
          this.dataSourceIsEmpty= false;

      });
      */
  }

  Load_Data() {
    this.LoadingFinish = false;
    this._Subscription .push(
       forkJoin(
      this.Load_sanad_kid_book(),
      this.Load_branch(),
    ).subscribe(
      res => {
        this.book_list = res[0];
        this.book_filter = of(this.book_list);
        this.sanadKidBookService.List_SanadKidBook = this.book_list;
        this.sanadKidBookService.List_SanadKidBook_BehaviorSubject.next(this.sanadKidBookService.List_SanadKidBook);

        this.branch_list = res[1];
        this.branch_filter = of(this.branch_list);
        this.BranchService.List_Branch = this.branch_list;
        this.BranchService.List_Branch_BehaviorSubject.next(this.BranchService.List_Branch);


        this.LoadingFinish = true;

      }
    )
    );
  }


  Load_sanad_kid_book(): Observable<sanad_kid_book[]> {
    if (this.sanadKidBookService.List_SanadKidBook == null ||
      this.sanadKidBookService.List_SanadKidBook == undefined ||
      this.sanadKidBookService.List_SanadKidBook.length == 0)
      return this.sanadKidBookService.list();
    return of(this.sanadKidBookService.List_SanadKidBook);
  }

  Load_branch(): Observable<branch[]> {
    if (this.BranchService.List_Branch == null ||
      this.BranchService.List_Branch == undefined ||
      this.BranchService.List_Branch.length == 0)
      return this.BranchService.list();
    return of(this.BranchService.List_Branch);
  }




  public display_Book_Property(value: number): string {
    if (value) {
      var books = this.book_list.filter(x => x.sanad_kid_book_seq == value);
      if (books != null && books.length > 0 && books[0].sanad_kid_book_name != null) {

        return books[0].sanad_kid_book_name;
      }

      return '';
    }
    return '';
  }


  onViewClick(request: any) {

    this.Request = request;
    this.isLoading = true;
    this.Subscriptions.push
      (

        this.exchangeOrderService.search(request)
          .subscribe((data: any) => {
            this.totalRows = data.total_row_count;
            this.dataSource = new MatTableDataSource(data.value);
            this.isLoading = false;
            if (data.value?.length != 0)
              this.dataSourceIsEmpty = false;


            this.totalRows = data.total_row_count;
            this.RowCount = data.total_row_count;

            let arr: exchange_order[] = [];

            arr = (data.value as exchange_order[]);
            if (arr != null && arr.length > 0) {
              this.SumTotal = arr.reduce((acc, cur) => acc + (cur.total_value != null ? cur.total_value : 0), 0);
            }

          })

      )




  }

  View() {
    this.isLoading = true;
    if (this.Request != null) {
      this.Request.page_index = this.currentPage;
      this.Request.row_count = this.pageSize;

    }

    this.exchangeOrderService.search(this.Request).subscribe((data: any) => {


      this.dataSource = new MatTableDataSource(data.value);
      this.isLoading = false;
      if (data.value?.length != 0)
        this.dataSourceIsEmpty = false;



      this.totalRows = data.total_row_count;
      this.RowCount = data.total_row_count;

      let arr: exchange_order[] = [];

      arr = (data.value as exchange_order[]);
      if (arr != null && arr.length > 0) {
        this.SumTotal = arr.reduce((acc, cur) => acc + (cur.total_value != null ? cur.total_value : 0), 0);
      }

    });


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


  Delete(order: exchange_order) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.exchangeOrderService.delete(order.exchange_order_seq!).subscribe(res => {
          if (res != null && (res as result) != null && (res as result).success == true) {
            this.snackBar.open('تم الحذف بنجاح', '', {
              duration: 3000,
              panelClass: ['green-snackbar'],
            });
            this.View();
            return;

          } else {
            this.snackBar.open('خطأ لم يتم الحذف', 'خطأ', {
              duration: 3000,
              panelClass: ['green-snackbar'],
            });
            return;
          }

        })
      }
    });
  }

  Update(order: exchange_order) {
    this.PageExchangeOrderService.exchange_order = order;
    this.PageExchangeOrderService.$exchange_order.next(order);

    this.router.navigate(['../edit'], { relativeTo: this.ActivatedRoute });

  }

  add() {
    this.PageExchangeOrderService.exchange_order = {
      exchange_order_details:[],
      exchange_order_attachements:[]
    };
    this.PageExchangeOrderService.$exchange_order.next({});
    this.router.navigate(['../edit'], { relativeTo: this.ActivatedRoute });
  }





  /*

   Delete(order: exchange_order) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.exchangeOrderService.delete(order.exchange_order_seq!).subscribe(res => {
          this.snackBar.open('تم الحذف بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        })
      }
    });
  }
  
  Update(order: exchange_order) {
    //this.router.navigate(['edit', { id: order.exchange_order_seq }])
    this.router.navigate(['../edit'],{relativeTo: this.ActivatedRoute});
  }

  add() {
    //this.router.navigate(['edit', { id: 0 }]);
    this.router.navigate(['../edit'],{relativeTo: this.ActivatedRoute});
  }
  */





  exportToExcel() {
    this.exchangeOrderService.export2Excel().subscribe(
      (res) => {
        const file: Blob = new Blob([res], { type: 'application/xlsx' });
        saveAs(file, `سندات القيد.xlsx`);
      }
    );
  }
}
