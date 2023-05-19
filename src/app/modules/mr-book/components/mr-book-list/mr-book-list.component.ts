import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { accounts_transactions } from 'src/app/modules/shared/models/accounts_transactions';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { MrBookService } from 'src/app/modules/shared/services/mr-book.service';

@Component({
  selector: 'app-mr-book-list',
  templateUrl: './mr-book-list.component.html',
  styleUrls: ['./mr-book-list.component.scss']
})
export class MrBookListComponent {

  Request : any ;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
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

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] =
    [
      'debtor',
    'creditor',
    'account_id',
    'account_name',
    'account_center_id',
    'account_center_name',
    'document_id',
    'document_date',
    'incumbent_id',
    'incumbent_date',
    'operation_type_name'];
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
  incumbent_id_from!: FormControl<number | null>;
  incumbent_id_to!: FormControl<number | null>;
  incumbent_date_from!: FormControl<Date | null>;
  incumbent_date_to!: FormControl<Date | null>;
  account_id_from!: FormControl<number | null>;
  account_id_to!: FormControl<number | null>;
  operation_types!: FormControl<string | null>;
  with_sanad_lock!: FormControl<number | null>;
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;
  account_ids!: FormControl<number[] | null>;

  selected_account_ids: number[]= [];

  LoadingFinish: boolean;

  accounts_tree_list: accounts_tree[];
  accounts_tree_filter: Observable<accounts_tree[]>;

  _Subscription: Subscription[]=[];



  RowCount: number = 0;
  SumTotal: number = 0;

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private accountTreeService: AccountTreeService,
    private mrBookService: MrBookService,

  ) {
    this.LoadingFinish = true;

    


  }

  ngOnInit(): void {
 
  }
      
      
  ngOnDestroy()
  {
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

  onViewClick(request: any) {

    this.Request = request;
    this.isLoading = true;
    this._Subscription.push
      (

        this.mrBookService.search(request)
          .subscribe((data: any) => {
            this.totalRows = data.total_row_count;
            this.dataSource = new MatTableDataSource(data.value);
            this.isLoading = false;
            if (data.value?.length != 0)
              this.dataSourceIsEmpty = false;


            this.totalRows = data.total_row_count;
            this.RowCount = data.total_row_count;

            let arr: accounts_transactions[] = [];

            arr = (data.value as accounts_transactions[]);
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

    this.mrBookService.search(this.Request).subscribe((data: any) => {


      this.dataSource = new MatTableDataSource(data.value);
      this.isLoading = false;
      if (data.value?.length != 0)
        this.dataSourceIsEmpty = false;



      this.totalRows = data.total_row_count;
      this.RowCount = data.total_row_count;

      let arr: accounts_transactions[] = [];

      arr = (data.value as accounts_transactions[]);
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

  exportToExcel() {

  }

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



}
