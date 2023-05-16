import { DOCUMENT } from '@angular/common';
import { Component, HostListener, ViewChild, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { combineLatest, forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { branch } from 'src/app/modules/shared/models/branch';
import { result } from 'src/app/modules/shared/models/result';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';
import { PageSanadKidService } from '../../pageservice/page-sanad-kid.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { sanad_kid_entry } from 'src/app/modules/shared/models/sanad-kid-entry';
import { PaymentSafeService } from 'src/app/modules/shared/services/payment_safe.service';
import { payment_safe } from 'src/app/modules/shared/models/payment_safe';
import { sanad_kid_detail } from 'src/app/modules/shared/models/sanad_kid_detail';
import { BranchService } from 'src/app/modules/shared/services/branch.service';

@Component({
  selector: 'app-sanad-kid-edit',
  templateUrl: './sanad-kid-edit.component.html',
  styleUrls: ['./sanad-kid-edit.component.scss']
})
export class SanadKidEditComponent implements OnInit, AfterViewInit {

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode == 120) {
      event.preventDefault();
      this.save();
    }

  }


  _sanad_kid: sanad_kid;

  get sanad_kid(): sanad_kid {
    return this._sanad_kid;
  }

  set sanad_kid(obj: sanad_kid) {
    this._sanad_kid = obj;
    this.SetValue();
  }





  _Subscription: Subscription[] = [];

  Form!: FormGroup;
  sanad_kid_seq!: FormControl<number | null>;
  document_id!: FormControl<number | null>;
  document_date!: FormControl<Date | null>;
  // operation_type_fk!: FormControl<number | null>;
  // operation_code_fk!: FormControl<number | null>;
  incumbent_id!: FormControl<number | null>;
  incumbent_date!: FormControl<Date | null>;
  sanad_kid_type_fk!: FormControl<number | null>;
  book_fk!: FormControl<number | null>;
  sanad_kid_book!: FormControl<sanad_kid_book | null>;
  sanad_total_value: FormControl<number | null>;
  sanad_close: FormControl<boolean | null>;
  name_of_owner: FormControl<string | null>;
  branch_fk: FormControl<number | null>;
  branch: FormControl<branch | null>;

  List_Payment_Safe: payment_safe[] = [];
  list_branch: branch[] = [];
  selected_sanad_kid_book: sanad_kid_book;

  List_sanad_kid_book: sanad_kid_book[];
  filter_List_sanad_kid_book: Observable<sanad_kid_book[]>;

  sanadDateDay: string = '';
  sanadDateMonth: string = '';
  sanadDateYear: string = '';
  incumbentDateDay: string = '';
  incumbentDateMonth: string = '';
  incumbentDateYear: string = '';

  sanadDateDayIsFilled: boolean = false;
  sanadDateMonthIsFilled: boolean = false;
  sanadDateYearIsFilled: boolean = false;
  incumbentDateDayIsFilled: boolean = false;
  incumbentDateMonthIsFilled: boolean = false;
  incumbentDateYearIsFilled: boolean = false;

  LoadingFinish: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource_sanad_kid_entry = new MatTableDataSource<sanad_kid_entry>();
  sanad_kid_entry_displayedColumns: string[] =
    ["snd_kid_stg_name", 'user_entry', 'date_entry'];

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sumCreditor: number = 0;
  sumDebtor: number = 0;
  balance: number = 0;
  actionNum: number = 0;




  constructor(
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private SanadKidBookService: SanadKidBookService,
    private PageSanadKidService: PageSanadKidService,
    private PaymentSafeService: PaymentSafeService,
    private BranchService: BranchService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private sanadKidService: SanadKidService) {
    this.LoadingFinish = true;
    this.BuildForm();
    this.loadData();




  }
  ngAfterViewInit(): void {
    this.dataSource_sanad_kid_entry.paginator = this.paginator;
    this.dataSource_sanad_kid_entry.sort = this.sort;

    setTimeout(() => {
      document.querySelector('c-sidebar')?.classList.add('hide');
    }, 1000);
  }

  load_sanad_kid_book(): Observable<sanad_kid_book[]> {
    if (this.SanadKidBookService.List_SanadKidBook != null &&
      this.SanadKidBookService.List_SanadKidBook.length > 0) {
      return of(this.SanadKidBookService.List_SanadKidBook);
    }
    return this.SanadKidBookService.list();
  }

  public Load_Payment_Safe(): Observable<any[]> {
    return this.PaymentSafeService.list();
  }

  public Load_Branch(): Observable<any[]> {
    return this.BranchService.list();
  }

  public Load_Sanad_Kid(sanad_kid_seq: number | number | undefined): Observable<result> {
    if (sanad_kid_seq == null ||
      sanad_kid_seq == undefined ||
      sanad_kid_seq == 0) {
      this.sanad_kid = {};
      this.sanad_kid.sanad_kid_details = [];
      this.sanad_kid.sanad_kid_attachements = [];
      this.Form.reset();
      this.dataSource_sanad_kid_entry.data = [];
      this.sumDebtor = 0;
      this.sumCreditor = 0;
      this.balance = 0;
      this.sanadDateDay = '';
      this.sanadDateMonth = '';
      this.sanadDateYear = '';
      this.incumbentDateDay = '';
      this.incumbentDateMonth = '';
      this.incumbentDateYear = '';

      this.sanadDateDayIsFilled = false;
      this.sanadDateMonthIsFilled = false;
      this.sanadDateYearIsFilled = false;
      this.incumbentDateDayIsFilled = false;
      this.incumbentDateMonthIsFilled = false;
      this.incumbentDateYearIsFilled = false;
      let result: result = {
        value: this.sanad_kid,
        error: '',
        success: true
      }
      return of(result);
    }

    return this.sanadKidService.getBySeq(sanad_kid_seq);
  }


  loadData() {
    combineLatest(this.PageSanadKidService.$sanad_kid).subscribe(
      res => {

        let sanad_kid_seq: number | undefined | null = res[0]?.sanad_kid_seq;

        var Sub = forkJoin(
          this.load_sanad_kid_book(),
          this.Load_Payment_Safe(),
          this.Load_Branch(),
          this.Load_Sanad_Kid(sanad_kid_seq),
          
        ).subscribe(
          res => {

            this.List_sanad_kid_book = res[0];
            this.filter_List_sanad_kid_book = of(res[0]);
            this.SanadKidBookService.List_SanadKidBook = res[0];
            this.SanadKidBookService.List_SanadKidBook_BehaviorSubject.next(res[0]);


            this.PaymentSafeService.List_Payment_Safe = res[1];
            this.PaymentSafeService.List_Payment_Safe_BehaviorSubject.next(res[1]);
            this.List_Payment_Safe = res[1];


            this.list_branch = res[2];

            if (res[3] != null && res[3].value != null)
              this.sanad_kid = res[3].value;

            this.updateSum();

            this.actionNum = this.sanad_kid.sanad_kid_details?.length!;

            if (this.sanad_kid != null &&
              this.sanad_kid.sanad_kid_entries != null) {
              this.dataSource_sanad_kid_entry.data = this.sanad_kid.sanad_kid_entries!;
            }

            this.Init_AutoComplete();
          }
        );
        this._Subscription.push(Sub);

      });

  }



  selectedBookOption(event: any) {

    const selectedValue = event.option.value;

    if (selectedValue != null) {

      var books = this.List_sanad_kid_book.filter(x => x.sanad_kid_book_seq == selectedValue);
      if (books != null && books.length > 0 && books[0].branch_fk != null) {
        this.selected_sanad_kid_book = books[0];
        this.branch_fk.setValue(books[0].branch_fk);

      }

    }

  }

  public async Init_AutoComplete() {

    if (this.List_sanad_kid_book != null) {
      this.filter_List_sanad_kid_book = this.book_fk.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterBook(value) : this.List_sanad_kid_book.slice())
        );
    }


  }

  private _filterBook(value: string): sanad_kid_book[] {
    if (this.List_sanad_kid_book != null)
      return this.List_sanad_kid_book.filter(option => option.sanad_kid_book_name != null && option.sanad_kid_book_name?.toString().includes(value));
    return [];
  }


  public displayBookProperty(value: string): string {

    if (value != null && this.List_sanad_kid_book != null) {
      let sanad_kid_book: sanad_kid_book | undefined = this.List_sanad_kid_book.find(val => val.sanad_kid_book_seq != null && val.sanad_kid_book_seq.toString() == value);
      if (sanad_kid_book != null && sanad_kid_book.sanad_kid_book_name != null)
        return sanad_kid_book.sanad_kid_book_name;
    }
    return '';
  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'sanad_kid_seq': this.sanad_kid_seq = new FormControl<number | null>(null, []),
          'document_id': this.document_id = new FormControl<number | null>(null, [Validators.required]),
          'document_date': this.document_date = new FormControl<Date | null>(null, [Validators.required]),
          'incumbent_date': this.incumbent_date = new FormControl<Date | null>(null, []),
          'incumbent_id': this.incumbent_id = new FormControl<number | null>(null, []),
          'sanad_close': this.sanad_close = new FormControl<boolean | null>(null, []),
          'sanad_total_value': this.sanad_total_value = new FormControl<number | null>(null, []),
          'book_fk': this.book_fk = new FormControl<number | null>(null, [Validators.required]),
          'sanad_kid_type_fk': this.sanad_kid_type_fk = new FormControl<number | null>(null, []),
          'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
          'sanad_kid_book': this.sanad_kid_book = new FormControl<sanad_kid_book | null>(null, []),
          'branch_fk': this.branch_fk = new FormControl<number | null>(null, []),
          'branch': this.branch = new FormControl<branch | null>(null, []),
        },
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }



  ngOnDestroy(): void {

    this._Subscription.forEach(Sub => {
      if (Sub != null) Sub.unsubscribe();
    });
  }


  ngOnInit() {

    //this.PageSanadKidService.new();

    /*
    let seq: number = this.route.snapshot.params['id'];
    if (seq != null && seq > 0) {
      this.sanadKidService.getBySeq(seq).subscribe((res: any) => {
        console.log('res.value', res.value);
        this.PageSanadKidService.set(res.value);
        this.updateSum();
        this.actionNum = this.sanad_kid.sanad_kid_details?.length!;
      })
    }
    else {
      this.PageSanadKidService.set({});
      this.sanad_kid.sanad_kid_details = [];
      this.sanad_kid.sanad_kid_attachements = [];
      this.Form.reset();
      this.dataSource_sanad_kid_entry.data = [];
      this.sumDebtor = 0;
      this.sumCreditor = 0;
      this.balance = 0;
      this.sanadDateDay = '';
      this.sanadDateMonth = '';
      this.sanadDateYear = '';
      this.incumbentDateDay = '';
      this.incumbentDateMonth = '';
      this.incumbentDateYear = '';

      this.sanadDateDayIsFilled = false;
      this.sanadDateMonthIsFilled = false;
      this.sanadDateYearIsFilled = false;
      this.incumbentDateDayIsFilled = false;
      this.incumbentDateMonthIsFilled = false;
      this.incumbentDateYearIsFilled = false;
    }
    */

  }

  rowClicked!: number;
  changeTableRowColor(idx: any) {
    if (this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }


  public SetValue() {

    if (this.sanad_kid != null && this.sanad_kid.sanad_kid_seq != null)
      this.sanad_kid_seq.setValue(this.sanad_kid?.sanad_kid_seq!);

    if (this.sanad_kid != null && this.sanad_kid.document_date != null) {
      this.document_date.setValue(this.sanad_kid.document_date);
      this.sanadDateDay = moment(this.document_date.value).date() + '';
      console.log('this.sanadDateDay', this.sanadDateDay);
      this.sanadDateMonth = (moment(this.document_date.value).month() + 1) + '';
      this.sanadDateYear = moment(this.document_date.value).year() + '';
      this.sanadDateDayIsFilled = true;
      this.sanadDateMonthIsFilled = true;
      this.sanadDateYearIsFilled = true;
    }

    if (this.sanad_kid != null && this.sanad_kid.incumbent_date != null) {
      this.incumbent_date.setValue(this.sanad_kid?.incumbent_date!);
      this.incumbentDateDay = moment(this.incumbent_date.value).date() + '';
      this.incumbentDateMonth = (moment(this.incumbent_date.value).month() + 1) + '';
      this.incumbentDateYear = moment(this.incumbent_date.value).year() + '';
      this.incumbentDateDayIsFilled = true;
      this.incumbentDateMonthIsFilled = true;
      this.incumbentDateYearIsFilled = true;
    }

    if (this.sanad_kid != null && this.sanad_kid.document_id != null)
      this.document_id.setValue(this.sanad_kid?.document_id!);


    if (this.sanad_kid != null && this.sanad_kid.incumbent_id != null)
      this.incumbent_id.setValue(this.sanad_kid?.incumbent_id!);

    if (this.sanad_kid != null && this.sanad_kid.sanad_close != null)
      this.sanad_close.setValue((this.sanad_kid?.sanad_close == 1 ? true : false)!);

    if (this.sanad_kid != null && this.sanad_kid.book_fk != null)
      this.book_fk.setValue(this.sanad_kid?.book_fk!);


    if (this.sanad_kid != null && this.sanad_kid.sanad_kid_book != null)
      this.sanad_kid_book.setValue(this.sanad_kid?.sanad_kid_book!);


    if (this.sanad_kid != null && this.sanad_kid.name_of_owner != null)
      this.name_of_owner.setValue(this.sanad_kid?.name_of_owner!);

    if (this.sanad_kid != null && this.sanad_kid.sanad_kid_type_fk != null)
      this.sanad_kid_type_fk.setValue(this.sanad_kid?.sanad_kid_type_fk!);

    if (this.sanad_total_value != null && this.sanad_kid.sanad_total_value != null)
      this.sanad_total_value.setValue(this.sanad_kid?.sanad_total_value!);


    if (this.sanad_kid != null && this.sanad_kid.branch_fk != null)
      this.branch_fk.setValue(this.sanad_kid!.branch_fk!);


  }


  getValue() {
    this.sanad_total_value.setValue(this.sum_details_debtor());
    this.sanad_kid.sanad_total_value = this.sanad_total_value.value!;

    this.sanad_kid.document_date = moment(this.sanadDateMonth + '/' + this.sanadDateDay + '/' + this.sanadDateYear).set({ hour: 4 }).toDate();
    this.sanad_kid.incumbent_date = moment(this.incumbentDateMonth + '/' + this.incumbentDateDay + '/' + this.incumbentDateYear).set({ hour: 4 }).toDate();
    this.sanad_kid.document_id = this.document_id.value!;
    this.sanad_kid.incumbent_id = this.incumbent_id.value!;
    this.sanad_kid.sanad_close = (this.sanad_close.value == true ? 1 : 0)!;
    this.sanad_kid.name_of_owner = this.name_of_owner.value!;
    this.sanad_kid.sanad_kid_type_fk = this.sanad_kid_type_fk.value!;

    this.sanad_kid.book_fk = undefined;
    this.sanad_kid.sanad_kid_book = undefined;

    this.sanad_kid.branch = this.branch.value!;
    this.sanad_kid.branch_fk = this.branch_fk.value!;
  }



  clear() {
    this.Form.reset();
  }



  focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  accountCard() {

  }






  sanadDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.sanadDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.sanadDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.sanadDateYearIsFilled = true;

    if (this.sanadDateDayIsFilled && this.sanadDateMonthIsFilled && this.sanadDateYearIsFilled) {
      this.document_date.setValue(moment(this.sanadDateMonth + '/' + this.sanadDateDay + '/' + this.sanadDateYear).set({ hour: 4 }).toDate());
    }
  }

  incumbentDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.incumbentDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.incumbentDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.incumbentDateYearIsFilled = true;

    if (this.incumbentDateDayIsFilled && this.incumbentDateMonthIsFilled && this.incumbentDateYearIsFilled) {
      this.incumbent_date.setValue(moment(this.incumbentDateMonth + '/' + this.incumbentDateDay + '/' + this.incumbentDateYear).set({ hour: 4 }).toDate());
    }
  }

  addAttachment() {
    this.sanad_kid.sanad_kid_attachements?.push({ sanad_kid_fk: this.sanad_kid.sanad_kid_seq });

  }


  onAttachmentDelete(index: number) {
    this.getValue();
    this.sanad_kid.sanad_kid_attachements?.splice(index, 1);

  }


  onDetailsDelete(index: number) {
    this.sanad_kid.sanad_kid_details?.splice(index, 1);

    this.sum_details_creditor();
    this.sum_details_debtor();
    this.actionNum = this.sanad_kid.sanad_kid_details?.length!;
  }


  addDetails() {
    this.sanad_kid.sanad_kid_details?.push({ sanad_Kid_fk: this.sanad_kid.sanad_kid_seq });

    this.actionNum = this.sanad_kid.sanad_kid_details?.length!;
    this.sum_details_creditor();
    this.sum_details_debtor();
  }

  updateSum() {
    this.balance = this.sum_details_creditor() - this.sum_details_debtor();
  }

  Payment_Safe_Check(sanad_kid_details: sanad_kid_detail): boolean {
    if (this.List_Payment_Safe != null) {
      var Result = this.List_Payment_Safe.filter(x => x.accounts_tree_fk == sanad_kid_details.accounts_tree_fk);
      if (Result != null && Result.length > 0)
        return true;
    }
    return false;

  }

  Add_Account_Tree_Payment_Safe_To_Details() {
    if (this.book_fk != null && this.book_fk.value != null && this.book_fk.value > 0) {

      var Results = this.List_sanad_kid_book.filter(x => x.sanad_kid_book_seq == this.book_fk.value);
      if (Results != null && Results.length > 0) {
        var sanad_kid_book = Results[0];
        var sum_debtor = this.sum_details_debtor();
        var sum_creditor = this.sum_details_creditor();
        if (sum_debtor > 0 && sum_debtor > sum_creditor) {
          let sanad_kid_detail: sanad_kid_detail = {
            account_center_fk: null,
            accounts_tree_fk: sanad_kid_book.cash_account_fk,
            creditor: sum_debtor,
            debtor: 0,
            account_notice: 'اضافة حساب الصندوق للموازنة'
          }
          this.sanad_kid.sanad_kid_details?.push(sanad_kid_detail);
        } else if (sum_creditor > 0 && sum_creditor > sum_debtor) {
          let sanad_kid_detail: sanad_kid_detail = {
            account_center_fk: null,
            accounts_tree_fk: sanad_kid_book.cash_account_fk,
            debtor: sum_creditor,
            creditor: 0,
            account_notice: 'اضافة حساب الصندوق للموازنة'
          }
          this.sanad_kid.sanad_kid_details?.push(sanad_kid_detail);
        }




      }



      if (
        this.List_Payment_Safe != null &&
        this.List_Payment_Safe.length > 0 &&
        this.sanad_kid != null && this.sanad_kid.sanad_kid_details != null) {
        let indexFound: number[] = [];

        this.sanad_kid.sanad_kid_details.forEach((det, index) => {
          if (det != null && det.accounts_tree_fk != null) {
            if (this.Payment_Safe_Check(det))
              indexFound.push(index);
          }
        });
        if (indexFound != null &&
          indexFound.length > 0) {
          indexFound.forEach(index => {
            this.sanad_kid.sanad_kid_details = this.sanad_kid.sanad_kid_details?.splice(index, 1);
          });
        }


      }


    }
  }


  Reomve_Account_Tree_Payment_Safe_From_Details() {


    if (
      this.List_Payment_Safe != null &&
      this.List_Payment_Safe.length > 0 &&
      this.sanad_kid != null &&
      this.sanad_kid.sanad_kid_details != null &&
      this.sanad_kid.sanad_kid_details.length > 0) {
      let indexFound: number[] = [];

      this.sanad_kid.sanad_kid_details.forEach((det, index) => {
        if (det != null && det.accounts_tree_fk != null) {
          if (this.Payment_Safe_Check(det))
            indexFound.push(index);
        }
      });

      if (indexFound != null &&
        indexFound.length > 0) {
        indexFound.forEach(index => {
          this.sanad_kid.sanad_kid_details = this.sanad_kid.sanad_kid_details?.splice(index, 1);
        });
      }





    }
  }


  select_Book_Option(event: any) {

    const selectedValue = event.option.value;

    if (selectedValue != null) {

      var books = this.List_sanad_kid_book.filter(x => x.sanad_kid_book_seq == selectedValue);
      if (books != null && books.length > 0 && books[0].branch_fk != null) {
        this.selected_sanad_kid_book = books[0];
        this.branch_fk.setValue(books[0].branch_fk);
        if (books[0].branch != null)
          this.branch.setValue(books[0].branch);



      }




    }

  }

  sum_details_debtor(): number {
    if (this.sanad_kid != null &&
      this.sanad_kid.sanad_kid_details != null &&
      this.sanad_kid.sanad_kid_details.length > 0) {

      let sum: number = 0;
      this.sanad_kid.sanad_kid_details.forEach(element => {
        if (element.debtor != null) sum = sum + (+element.debtor);
      });

      this.sumDebtor = sum;
      return sum;

    }

    return 0;


  }

  sum_details_creditor(): number {
    if (this.sanad_kid != null &&
      this.sanad_kid.sanad_kid_details != null &&
      this.sanad_kid.sanad_kid_details.length > 0) {

      let sum: number = 0;
      this.sanad_kid.sanad_kid_details.forEach(element => {
        if (element.creditor != null) sum = sum + (+element.creditor);
      });

      this.sumCreditor = sum;
      return sum;

    }
    return 0;
  }

  vaidate_details() {


  }

  save_as_draft() {

    this.sanad_kid_type_fk.setValue(2);

    let Sum_Debt = this.sum_details_debtor();
    let Sum_Creditor = this.sum_details_creditor();
    /*
    if (Sum_Debt != Sum_Creditor) {
      this.snackBar.open('يجب أن يتساوى مجموع الدائن مع مجموع المدين', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
      });
      return;

    }
    */

    this.getValue();
    if (this.sanad_kid.sanad_kid_seq != null && this.sanad_kid.sanad_kid_seq > 0) {
      this.sanadKidService.update(this.sanad_kid).subscribe(res => {
        if (res != null && (res as result) != null && (res as result).success) {
          this.snackBar.open('تم الحفظ بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        }
        else
          this.snackBar.open('حدث خطأ', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });
      });
    }
    else {
      console.log('this.sanad_kid', this.sanad_kid);
      this.sanadKidService.add(this.sanad_kid).subscribe(res => {
        console.log('res', res);
        if (res != null && (res as result) != null && (res as result).success) {
          this.snackBar.open('تم الحفظ بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        }
        else
          this.snackBar.open('حدث خطأ', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });
      });
    }
  }


  save() {

    this.sanad_kid_type_fk.setValue(1);

    let Sum_Debt = this.sum_details_debtor();
    let Sum_Creditor = this.sum_details_creditor();
    if (Sum_Debt != Sum_Creditor) {

      this.snackBar.open('يجب أن يتساوى مجموع الدائن مع مجموع المدين', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
      });
      return;

    }




    this.getValue();
    console.log('this.sanad_kid', this.sanad_kid);
    if (this.sanad_kid.sanad_kid_seq != null && this.sanad_kid.sanad_kid_seq > 0) {
      this.sanadKidService.update(this.sanad_kid).subscribe(res => {
        if (res != null && (res as result) != null && (res as result).success) {
          this.snackBar.open('تم الحفظ بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        }
        else
          this.snackBar.open('حدث خطأ', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });
      });
    }
    else {
      console.log('this.sanad_kid', this.sanad_kid);
      this.sanadKidService.add(this.sanad_kid).subscribe(res => {
        console.log('res', res);
        if (res != null && (res as result) != null && (res as result).success) {
          this.snackBar.open('تم الحفظ بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        }
        else
          this.snackBar.open('حدث خطأ', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });
      });
    }
  }


  OnSelectItem(sanad_kid: sanad_kid) {

  }


  ShowEntry(element:any)
  {
    

  }

}
