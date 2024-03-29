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
import { receipt_order } from 'src/app/modules/shared/models/receipt_order';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { ReceiptOrderService } from 'src/app/modules/shared/services/receipt-order.service';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { PageReceiptOrderService } from '../../pageservice/page-receipt-order.service';
import { result } from 'src/app/modules/shared/models/result';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-receipt-order-list',
  templateUrl: './receipt-order-list.component.html',
  styleUrls: ['./receipt-order-list.component.scss']
})
export class ReceiptOrderListComponent {
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

  dataSource = new MatTableDataSource<receipt_order>();
  displayedColumns: string[] =
    ['incumbent_id', 'incumbent_date', 'document_id', 'document_date', 'total_value', 'name_of_owner', 'branch_fk', 'action'];
    dataSourceIsEmpty: boolean= true;
  fromSanadDateDay: string = '';
  fromSanadDateMonth: string = '';
  fromSanadDateYear: string = '';
  toSanadDateDay: string = '';
  toSanadDateMonth: string = '';
  toSanadDateYear: string = '';

  fromSanadDateDayIsFilled: boolean = false;
  fromSanadDateMonthIsFilled: boolean = false;
  fromSanadDateYearIsFilled: boolean = false;
  toSanadDateDayIsFilled: boolean = false;
  toSanadDateMonthIsFilled: boolean = false;
  toSanadDateYearIsFilled: boolean = false;

  fromIncumbentDateDay: string = '';
  fromIncumbentDateMonth: string = '';
  fromIncumbentDateYear: string = '';
  toIncumbentDateDay: string = '';
  toIncumbentDateMonth: string = '';
  toIncumbentDateYear: string = '';

  fromIncumbentDateDayIsFilled: boolean = false;
  fromIncumbentDateMonthIsFilled: boolean = false;
  fromIncumbentDateYearIsFilled: boolean = false;
  toIncumbentDateDayIsFilled: boolean = false;
  toIncumbentDateMonthIsFilled: boolean = false;
  toIncumbentDateYearIsFilled: boolean = false;

  Form!: FormGroup;
  document_id_from!: FormControl<number | null>;
  document_id_to!: FormControl<number | null>;
  document_date_from!: FormControl<Date | null>;
  document_date_to!: FormControl<Date | null>;
  sanad_kid_fk!: FormControl<number | null>;
  incumbent_id_from!: FormControl<number | null>;
  incumbent_id_to!: FormControl<number | null>;
  incumbent_date_from!: FormControl<Date | null>;
  incumbent_date_to!: FormControl<Date | null>;
  receipt_order_type_fk!: FormControl<number | null>;
  book_fk!: FormControl<number | null>;
  name_of_owner!: FormControl<string | null>;
  attach!: FormControl<string | null>;
  branch_fk!: FormControl<number | null>;
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;

  LoadingFinish: boolean;

  book_list: sanad_kid_book[];
  book_filter: Observable<sanad_kid_book[]>;

  branch_list: branch[];
  branch_filter: Observable<branch[]>;

  _Subscription!: Subscription;





  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;
  

  selected_order: receipt_order = {};

  displayed_rows: receipt_order[]= [];

  receiptPrintRowsInput: receipt_order[]= [];

  constructor(
    private fb: FormBuilder,
    private ActivatedRoute:ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private receiptOrderService: ReceiptOrderService,
    private PageReceiptOrderService:PageReceiptOrderService,
    private sanadKidBookService: SanadKidBookService,
    private BranchService: BranchService,
  ) {
    this.LoadingFinish = true;

    this.BuildForm();
    this.Load_Data();


  }

  ngOnInit(): void {
 
  }
      
      
  ngOnDestroy()
  {

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


  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'document_id_from': this.document_id_from = new FormControl<number | null>(null, []),
          'document_id_to': this.document_id_to = new FormControl<number | null>(null, []),
          'document_date_from': this.document_date_from = new FormControl<Date | null>(null, []),
          'document_date_to': this.document_date_to = new FormControl<Date | null>(null, []),
          'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, []),
          'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null, []),
          'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null, []),
          'incumbent_date_from': this.incumbent_date_from = new FormControl<Date | null>(null, []),
          'incumbent_date_to': this.incumbent_date_to = new FormControl<Date | null>(null, []),
          'receipt_order_type_fk': this.receipt_order_type_fk = new FormControl<number | null>(null, []),
          'book_fk': this.book_fk = new FormControl<number | null>(null, []),
          
          'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
          'attach': this.attach = new FormControl<string | null>(null, []),
          'branch_fk': this.branch_fk = new FormControl<number | null>(null, []),
          'page_index': this.page_index = new FormControl<number | null>(null, []),
          'row_count': this.row_count = new FormControl<number | null>(null, []),
        }
      );


    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    this.LoadingFinish = false;
    this._Subscription = forkJoin(
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


  public async Init_AutoComplete() {
    try {

      this.book_filter = this.book_fk.valueChanges
        .pipe(
          startWith(''),
          map((value) => value && typeof value === 'string' ? this._filter_book(value) : this.book_list.slice())
        );

      this.branch_filter = this.branch_fk.valueChanges
        .pipe(
          startWith(''),
          map((value) => value && typeof value === 'string' ? this._filter_branch(value) : this.branch_list.slice())
        );


    } catch (Exception: any) { }
  }


  private _filter_book(value: string): sanad_kid_book[] {
    const filterValue = value.toLowerCase();
    return this.book_list.filter(option => option.sanad_kid_book_name != null && option.sanad_kid_book_name.includes(filterValue));
  }


  private _filter_branch(value: string): branch[] {
    return this.branch_list.filter(option => option.branch_name != null && option.branch_name.includes(value));
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

        this.receiptOrderService.search(request)
          .subscribe((data: any) => {
            this.totalRows = data.total_row_count;
            this.dataSource = new MatTableDataSource(data.value);
            this.displayed_rows= data.value;

            this.isLoading = false;
            if (data.value?.length != 0)
              this.dataSourceIsEmpty = false;


            this.totalRows = data.total_row_count;
            this.RowCount = data.total_row_count;

            let arr: receipt_order[] = [];

            arr = (data.value as receipt_order[]);
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

    this.receiptOrderService.search(this.Request).subscribe((data: any) => {


      this.dataSource = new MatTableDataSource(data.value);
      this.displayed_rows= data.value;
      this.isLoading = false;
      if (data.value?.length != 0)
        this.dataSourceIsEmpty = false;



      this.totalRows = data.total_row_count;
      this.RowCount = data.total_row_count;

      let arr: receipt_order[] = [];

      arr = (data.value as receipt_order[]);
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


  Delete(order: receipt_order) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.receiptOrderService.delete(order.receipt_order_seq!).subscribe(res => {
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

  Update(order: receipt_order) {
    this.PageReceiptOrderService.receipt_order = order;
    this.PageReceiptOrderService.$receipt_order.next(order);

    this.router.navigate(['../edit'], { relativeTo: this.ActivatedRoute });

  }

  add() {
    this.PageReceiptOrderService.receipt_order = {};
    this.PageReceiptOrderService.$receipt_order.next({});
    this.router.navigate(['../edit'], { relativeTo: this.ActivatedRoute });
  }
  
  /*

  Delete(order: receipt_order) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.receiptOrderService.delete(order.receipt_order_seq!).subscribe(res => {
          this.snackBar.open('تم الحذف بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        })
      }
    });
  }

  Update(order: receipt_order) {
    this.router.navigate(['../edit'],{relativeTo: this.ActivatedRoute});

  }

  add() {
    this.router.navigate(['../edit'],{relativeTo: this.ActivatedRoute});
  }

*/

  fromSanadDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.fromSanadDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.fromSanadDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.fromSanadDateYearIsFilled = true;

    if (this.fromSanadDateDayIsFilled && this.fromSanadDateMonthIsFilled && this.fromSanadDateYearIsFilled) {
      this.document_date_from.setValue(moment(this.fromSanadDateMonth + '/' + this.fromSanadDateDay + '/' + this.fromSanadDateYear).set({ hour: 2 }).toDate());
    }
  }

  toSanadDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.toSanadDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.toSanadDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.toSanadDateYearIsFilled = true;

    if (this.toSanadDateDayIsFilled && this.toSanadDateMonthIsFilled && this.toSanadDateYearIsFilled) {
      this.document_date_to.setValue(moment(this.toSanadDateMonth + '/' + this.toSanadDateDay + '/' + this.toSanadDateYear).set({ hour: 2 }).toDate());
    }
  }

  fromIncumbentDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.fromIncumbentDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.fromIncumbentDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.fromIncumbentDateYearIsFilled = true;

    if (this.fromIncumbentDateDayIsFilled && this.fromIncumbentDateMonthIsFilled && this.fromIncumbentDateYearIsFilled) {
      this.incumbent_date_from.setValue(moment(this.fromIncumbentDateMonth + '/' + this.fromIncumbentDateDay + '/' + this.fromIncumbentDateYear).set({ hour: 2 }).toDate());
    }
  }

  toIncumbentDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.toIncumbentDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.toIncumbentDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.toIncumbentDateYearIsFilled = true;

    if (this.toIncumbentDateDayIsFilled && this.toIncumbentDateMonthIsFilled && this.toIncumbentDateYearIsFilled) {
      this.incumbent_date_to.setValue(moment(this.toIncumbentDateMonth + '/' + this.toIncumbentDateDay + '/' + this.toIncumbentDateYear).set({ hour: 2 }).toDate());
    }
  }



  select_Book_Option(event: any) {

    const selectedValue = event.option.value;

    if (selectedValue != null) {

      var books = this.book_list.filter(x => x.sanad_kid_book_seq == selectedValue);
      if (books != null && books.length > 0 && books[0].branch_fk != null) {
        
        this.branch_fk.setValue(books[0].branch_fk);


      }

    }

  }


  exportToExcel() {
    this.receiptOrderService.export2Excel().subscribe(
      (res) => {
        const file: Blob = new Blob([res], { type: 'application/xlsx' });
        saveAs(file, `سندات القيد.xlsx`);
      }
    );
  }

  printRows(rows: receipt_order[]){
    this.receiptPrintRowsInput= rows;
   }
}
