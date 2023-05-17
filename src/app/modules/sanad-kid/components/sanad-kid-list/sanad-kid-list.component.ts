import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import * as _moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import * as moment from 'moment';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { PageSanadKidService } from '../../pageservice/page-sanad-kid.service';
import { result } from 'src/app/modules/shared/models/result';

@Component({
  selector: 'app-sanad-kid-list',
  templateUrl: './sanad-kid-list.component.html',
  styleUrls: ['./sanad-kid-list.component.scss']
})

export class SanadKidListComponent implements OnInit {
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

  dataSource = new MatTableDataSource<sanad_kid>();
  displayedColumns: string[] =
    ['operation_type_fk', 'operation_code_fk', 'date_time_create', 'document_id', 'document_date', 'total_value', 'incumbent_id', 'incumbent_date', 'sanad_close', 'name_of_owner', 'branch_name', 'action'];
  dataSourceIsEmpty: boolean = true;
  fromDateDay: string = '';
  fromDateMonth: string = '';
  fromDateYear: string = '';
  toDateDay: string = '';
  toDateMonth: string = '';
  toDateYear: string = '';

  fromDateDayIsFilled: boolean = false;
  fromDateMonthIsFilled: boolean = false;
  fromDateYearIsFilled: boolean = false;
  toDateDayIsFilled: boolean = false;
  toDateMonthIsFilled: boolean = false;
  toDateYearIsFilled: boolean = false;

  Form!: FormGroup;
  sanad_kid_date_from!: FormControl<Date | null>;
  sanad_kid_date_to!: FormControl<Date | null>;
  sanad_kid_seq!: FormControl<number | null>;
  incumbent_id_from!: FormControl<number | null>;
  incumbent_id_to!: FormControl<number | null>;
  sanad_kid_id_from!: FormControl<number | null>;
  sanad_kid_id_to!: FormControl<number | null>;
  sanad_close!: FormControl<number | null>;
  sanad_close_boolean!: FormControl<boolean | null>;
  name_of_owner!: FormControl<string | null>;
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean = false;
  selected_sanad: sanad_kid = {};

  displayed_rows: sanad_kid[]= [];
  sanadPrintRowsInput: sanad_kid[]= [];

  constructor(
    private fb: UntypedFormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private sanadKidService: SanadKidService,
    private PageSanadKidService: PageSanadKidService,

    private account_centerService: account_centerService,
    private accountTreeService: AccountTreeService,
    private router: Router
  ) {

    this.BuildForm();
  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'sanad_kid_date_from': this.sanad_kid_date_from = new FormControl<Date | null>(null, []),
          'sanad_kid_date_to': this.sanad_kid_date_to = new FormControl<Date | null>(null, []),
          'sanad_kid_seq': this.sanad_kid_seq = new FormControl<number | null>(null, []),
          'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null, []),
          'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null, []),
          'sanad_kid_id_from': this.sanad_kid_id_from = new FormControl<number | null>(null, []),
          'sanad_kid_id_to': this.sanad_kid_id_to = new FormControl<number | null>(null, []),
          'sanad_close': this.sanad_close = new FormControl<number | null>(null, []),
          'sanad_close_boolean': this.sanad_close_boolean = new FormControl<boolean | null>(null, []),
          'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
          'page_index': this.page_index = new FormControl<number | null>(null, []),
          'row_count': this.row_count = new FormControl<number | null>(null, []),
        }
      );


    } catch (Exception: any) {
      console.log(Exception);
    }
  }







  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;



  }

  rowClicked!: number;
  changeTableRowColor(idx: any) {
    if (this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  onViewClick(request: any) {

    this.Request = request;
    this.isLoading = true;
    this.Subscriptions.push
      (

        this.sanadKidService.search(request)
          .subscribe((data: any) => {
            if (data != null && data.value != null) {
              this.totalRows = data.total_row_count;
              this.dataSource = new MatTableDataSource(data.value);
              this.displayed_rows= data.value;

              this.isLoading = false;
              if (data.value?.length != 0)
                this.dataSourceIsEmpty = false;


              this.totalRows = data.total_row_count;
              this.RowCount = data.total_row_count;

              let arr: sanad_kid[] = [];

              arr = (data.value as sanad_kid[]);
              if (arr != null && arr.length > 0) {
                this.SumTotal = arr.reduce((acc, cur) => acc + (cur.total_value != null ? cur.total_value : 0), 0);
              }

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

    this.sanadKidService.search(this.Request).subscribe((data: any) => {


      this.dataSource = new MatTableDataSource(data.value);
      this.displayed_rows= data.value;

      this.isLoading = false;
      if (data.value?.length != 0)
        this.dataSourceIsEmpty = false;



      this.totalRows = data.total_row_count;
      this.RowCount = data.total_row_count;

      let arr: sanad_kid[] = [];

      arr = (data.value as sanad_kid[]);
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
    this.sanadKidService.export2Excel().subscribe(
      (res) => {
        const file: Blob = new Blob([res], { type: 'application/xlsx' });
        saveAs(file, `سندات القيد.xlsx`);
      }
    );
  }

  Delete(sanad: sanad_kid) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.sanadKidService.delete(sanad.sanad_kid_seq!).subscribe(res => {
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

  Update(order: sanad_kid) {

    if (order != null && order.operation_type_fk == 4) {
      this.PageSanadKidService.sanad_kid = order;
      this.PageSanadKidService.$sanad_kid.next(order);

      this.router.navigate(['../edit'], { relativeTo: this.ActivatedRoute });

    } else {
      this.snackBar.open('خطأ .. لا يجوز تعديل سند قيد مرتبط بأحد أوامر الصرف أو القبض أو الدفع', 'خطأ', {
        duration: 3000,
        panelClass: ['green-snackbar'],
      });
      return;

    }


  }

  add() {
    this.PageSanadKidService.sanad_kid = {
      sanad_kid_details: [],
      sanad_kid_attachements: [],
      sanad_close: 0,
      sanad_opening: 0
    };
    this.PageSanadKidService.$sanad_kid.next({});
    this.router.navigate(['../edit'], { relativeTo: this.ActivatedRoute });
  }

  add_sanad_opening() {
    this.PageSanadKidService.sanad_kid = {
      sanad_kid_details: [],
      sanad_kid_attachements: [],
      sanad_close: 0,
      sanad_opening: 1
    };
    this.PageSanadKidService.$sanad_kid.next({});
    this.router.navigate(['../edit'], { relativeTo: this.ActivatedRoute });
  }

  add_sanad_closing() {
    this.PageSanadKidService.sanad_kid = {
      sanad_kid_details: [],
      sanad_kid_attachements: [],
      sanad_close: 1,
      sanad_opening: 0
    };
    this.PageSanadKidService.$sanad_kid.next({});
    this.router.navigate(['../edit'], { relativeTo: this.ActivatedRoute });
  }

  detail() {

  }

  nextDocs() {

  }


  fromDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.fromDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.fromDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.fromDateYearIsFilled = true;

    if (this.fromDateDayIsFilled && this.fromDateMonthIsFilled && this.fromDateYearIsFilled) {
      this.sanad_kid_date_from.setValue(moment(this.fromDateMonth + '/' + this.fromDateDay + '/' + this.fromDateYear).set({ hour: 2 }).toDate());
    }
  }

  toDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.toDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.toDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.toDateYearIsFilled = true;

    if (this.toDateDayIsFilled && this.toDateMonthIsFilled && this.toDateYearIsFilled) {
      this.sanad_kid_date_to.setValue(moment(this.toDateMonth + '/' + this.toDateDay + '/' + this.toDateYear).set({ hour: 2 }).toDate());
    }
  }

  printRows(rows: sanad_kid[]){
    this.sanadPrintRowsInput= rows;
   }

}
