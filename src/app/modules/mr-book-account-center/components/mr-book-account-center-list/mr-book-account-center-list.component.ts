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
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { MrBookAccountCenterService } from 'src/app/modules/shared/services/mr-book-account-center.service';

@Component({
  selector: 'app-mr-book-account-center-list',
  templateUrl: './mr-book-account-center-list.component.html',
  styleUrls: ['./mr-book-account-center-list.component.scss']
})
export class MrBookAccountCenterListComponent {
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
    ['document_id', 'incumbent_date', 'document_id','account_center_name',  'document_date', 'account_center_name', 'operation_type', 'sanad_kid_book_name'];

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
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;
  account_center!: FormControl<account_center | null>;
  account_center_id_from!: FormControl<number | null>;
  account_center_id_to!: FormControl<number | null>;
  incumbent_type!: FormControl<string[] | null>;
  incumbent_month!: FormControl<number[] | null>;
  sanad_month!: FormControl<number[] | null>;
  account_ids!: FormControl<number[] | null>;

  selected_account_ids: number[]= [];

  LoadingFinish: boolean;

  accounts_tree_list: accounts_tree[];
  accounts_tree_filter: Observable<accounts_tree[]>;
  account_center_list: account_center[];
  account_center_filter: Observable<account_center[]>;

  _Subscription!: Subscription;

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private accountTreeService: AccountTreeService,
    private account_centerService: account_centerService,
    private mrBookAccountCenterService: MrBookAccountCenterService
  ) {
    this.LoadingFinish = true;

    this.BuildForm();
    this.Load_Data();


  }

  ngOnInit(): void {
 
  }
      
      
  ngOnDestroy()
  {
    this._Subscription.unsubscribe();
  }

    
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

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
        // this.totalRows = data.Item2;
        this.dataSource = new MatTableDataSource(data.value);
        this.isLoading= false;

      });
  }


  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'document_id_from': this.document_id_from = new FormControl<number | null>(null, []),
          'document_id_to': this.document_id_to = new FormControl<number | null>(null, []),
          'document_date_from': this.document_date_from = new FormControl<Date | null>(null, []),
          'document_date_to': this.document_date_to = new FormControl<Date | null>(null, []),
          'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null, []),
          'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null, []),
          'incumbent_date_from': this.incumbent_date_from = new FormControl<Date | null>(null, []),
          'incumbent_date_to': this.incumbent_date_to = new FormControl<Date | null>(null, []),
          'account_id_from': this.account_id_from = new FormControl<number | null>(null, []),
          'account_id_to': this.account_id_to = new FormControl<number | null>(null, []),
          'account_ids': this.account_ids = new FormControl<number[] | null>(null, []),
          'page_index': this.page_index = new FormControl<number | null>(null, []),
          'row_count': this.row_count = new FormControl<number | null>(null, []),
          'account_center_id_from': this.account_center_id_from = new FormControl<number | null>(null, []),
          'account_center_id_to': this.account_center_id_to = new FormControl<number | null>(null, []),
          'account_center': this.account_center = new FormControl<account_center | null>(null, []),
          'incumbent_type': this.incumbent_type = new FormControl<string[] | null>(null, []),
          'incumbent_month': this.incumbent_month = new FormControl<number[] | null>(null, []),
          'sanad_month': this.sanad_month = new FormControl<number[] | null>(null, []),

        }
      );


    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    this.LoadingFinish = false;
    this._Subscription = forkJoin(
      this.Load_Account_Tree(),
      this.Load_Account_Center(),
    ).subscribe(
      res => {
        
        this.accounts_tree_list = res[0];
        this.accounts_tree_filter = of(this.accounts_tree_list);
        this.accountTreeService.List_AccountsTree = this.accounts_tree_list;
        this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.accountTreeService.List_AccountsTree);

        this.account_center_list = res[1];
        this.account_center_filter = of(this.account_center_list);
        this.account_centerService.List_account_center = this.account_center_list;
        this.account_centerService.List_account_center_BehaviorSubject.next(this.account_centerService.List_account_center);


        this.LoadingFinish = true;

      }
    )
  }



  Load_Account_Tree(): Observable<accounts_tree[]> {
    if (this.accountTreeService.List_AccountsTree == null ||
      this.accountTreeService.List_AccountsTree == undefined ||
      this.accountTreeService.List_AccountsTree.length == 0)
      return this.accountTreeService.list();
    return of(this.accountTreeService.List_AccountsTree);
  }
  
  Load_Account_Center(): Observable<account_center[]> {
    if (this.account_centerService.List_account_center == null ||
      this.account_centerService.List_account_center == undefined ||
      this.account_centerService.List_account_center.length == 0)
      return this.account_centerService.list();
    return of(this.account_centerService.List_account_center);
  }

  onViewClick(){
    this.currentPage=0;
    this.pageSize=5;
    this.View().subscribe((data: any)=>{
      // this.totalRows = data.Item2;
      console.log('data.value', data.value);
      this.dataSource = new MatTableDataSource(data.value);
      this.isLoading= false;
    });
  }

  View() {
    this.isLoading= true;
    this.page_index.setValue(this.currentPage);
    this.row_count.setValue(this.pageSize);
    this.account_ids.setValue(this.selected_account_ids);

    return this.mrBookAccountCenterService.search(this.Form.value);


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
