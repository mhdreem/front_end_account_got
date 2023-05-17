import { DOCUMENT } from '@angular/common';
import { Component, ViewChild, Inject, OnInit, AfterViewInit, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { branch } from 'src/app/modules/shared/models/branch';
import { result } from 'src/app/modules/shared/models/result';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { sanad_kid_entry } from 'src/app/modules/shared/models/sanad-kid-entry';
import { PaymentSafeService } from 'src/app/modules/shared/services/payment_safe.service';
import { payment_safe } from 'src/app/modules/shared/models/payment_safe';
import { sanad_kid_detail } from 'src/app/modules/shared/models/sanad_kid_detail';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { attachement_type } from 'src/app/modules/shared/models/attachement_type';
import { validate_account_center } from '../sanad-kid-detail/validators/validate_account_center';
import { validate_account_tree } from '../sanad-kid-detail/validators/validate_account_tree';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { sanad_kid_attachement } from 'src/app/modules/shared/models/sanad_kid_attachement';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/modules/shared/services/date-formate';

@Component({
  selector: 'app-sanad-kid-edit',
  templateUrl: './sanad-kid-edit.component.html',
  styleUrls: ['./sanad-kid-edit.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class SanadKidEditComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Output() OnSaveComplete: EventEmitter<any> = new EventEmitter<any>();


  _sanad_kid: sanad_kid;
  get sanad_kid(): sanad_kid {
    return this._sanad_kid;
  }

  @Input() set sanad_kid(obj: sanad_kid) {


    this._sanad_kid = {};
    this.clear();


    this._sanad_kid = obj;

    if (this._sanad_kid == null)
      this._sanad_kid = {};

    if (this._sanad_kid.sanad_kid_attachements == null ||
      this._sanad_kid.sanad_kid_attachements.length == 0)
      this._sanad_kid.sanad_kid_attachements = [];

    if (this._sanad_kid == null ||
      this._sanad_kid.sanad_kid_details == null ||
      this._sanad_kid.sanad_kid_details.length == 0)
      this._sanad_kid.sanad_kid_details = [];

    if (this._sanad_kid == null ||
      this._sanad_kid.sanad_kid_entries == null ||
      this._sanad_kid.sanad_kid_entries.length == 0)
      this._sanad_kid.sanad_kid_entries = [];


    this.SetValue();


    if (this._sanad_kid != null &&
      this._sanad_kid.sanad_kid_details != null)
      this._sanad_kid.sanad_kid_details.forEach((detail, index) => {
        this.get_detail_formarray().push(this.add_detail(detail, index));


      });
    this.update_details_data();

    if (this._sanad_kid != null &&
      this._sanad_kid.sanad_kid_attachements != null &&
      this._sanad_kid.sanad_kid_attachements.length > 0)
      this._sanad_kid.sanad_kid_attachements.forEach((detail, index) => {
        this.get_attachments_formarray().push(this.add_attachment(detail, index));


      });
    this.update_attachenets_data();


    if (this._sanad_kid != null &&
      this._sanad_kid.sanad_kid_entries != null) {
      this.dataSource_sanad_kid_entry.data = this.sanad_kid.sanad_kid_entries!;
    }
  }



  _Subscription: Subscription[] = [];
  List_Payment_Safe: payment_safe[] = [];
  list_branch: branch[] = [];
  List_sanad_kid_book: sanad_kid_book[];
  filter_List_sanad_kid_book: Observable<sanad_kid_book[]>;

  selected_sanad_kid_book: sanad_kid_book;


  Form!: FormGroup;
  sanad_kid_seq!: FormControl<number | null>;
  sanad_kid_fk!: FormControl<number | null>;
  document_id!: FormControl<number | null>;
  document_date!: FormControl<string | null>;
  incumbent_id!: FormControl<number | null>;
  incumbent_date!: FormControl<string | null>;
  sanad_kid_type_fk!: FormControl<number | null>;
  total_value: FormControl<number | null>;
  name_of_owner: FormControl<string | null>;
  book_fk: FormControl<number | null>;
  sanad_kid_book: FormControl<sanad_kid_book | null>;
  branch_fk: FormControl<number | null>;
  branch: FormControl<branch | null>;


  LoadingFinish: boolean;


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
  Length_details: number = 0;
  Length_attachements: number = 0;

  safe_detail: sanad_kid_detail;

  constructor(

    public route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private SanadKidBookService: SanadKidBookService,
    @Inject(DOCUMENT) private _document: Document,
    private SanadKidService: SanadKidService,
    private PaymentSafeService: PaymentSafeService,
    private BranchService: BranchService,
    private AccountTreeService: AccountTreeService,
  ) {

    this.LoadingFinish = true;

    this.BuildForm();

    this.loadData();

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {

    this._Subscription.forEach(Sub => {
      if (Sub != null) Sub.unsubscribe();
    });
  }

  public Load_Payment_Safe(): Observable<any[]> {
    return this.PaymentSafeService.list();
  }

  public Load_Branch(): Observable<any[]> {
    return this.BranchService.list();
  }


  public Load_sanad_kid(sanad_kid_seq: number | number | undefined): Observable<result> {
    if (sanad_kid_seq == null ||
      sanad_kid_seq == undefined ||
      sanad_kid_seq == 0) {
      this.sanad_kid = {};
      this.sanad_kid.sanad_kid_details = [];
      this.sanad_kid.sanad_kid_attachements = [];
      this.clear();
      this.dataSource_sanad_kid_entry.data = [];
      this.sumDebtor = 0;
      this.sumCreditor = 0;
      this.balance = 0;

      let result: result = {
        value: this.sanad_kid,
        error: '',
        success: true
      }
      return of(result);
    }

    return this.SanadKidService.getBySeq(sanad_kid_seq);
  }

  load_sanad_kid_book(): Observable<sanad_kid_book[]> {
    if (this.SanadKidBookService.List_SanadKidBook != null &&
      this.SanadKidBookService.List_SanadKidBook.length > 0) {
      return of(this.SanadKidBookService.List_SanadKidBook);
    }

    return this.SanadKidBookService.list();

  }


  loadData() {

    this._Subscription.push
      (
        forkJoin(
          this.load_sanad_kid_book(),
          this.Load_Payment_Safe(),
          this.Load_Branch(),

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

            this.SetValue();
          }
        )
      );
  }



  ngOnInit() {

  }

  ngAfterViewInit() {
    this.dataSource_sanad_kid_entry.paginator = this.paginator;
    this.dataSource_sanad_kid_entry.sort = this.sort;
  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'sanad_kid_seq': this.sanad_kid_seq = new FormControl<number | null>(null, []),// Primary Key
          'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, []),
          'document_id': this.document_id = new FormControl<number | null>(null, [Validators.required]),
          'document_date': this.document_date = new FormControl<string | null>(null, [Validators.required]),
          'incumbent_id': this.incumbent_id = new FormControl<number | null>(null, []),
          'incumbent_date': this.incumbent_date = new FormControl<string | null>(null, []),
          'sanad_kid_type_fk': this.sanad_kid_type_fk = new FormControl<number | null>(null, []),
          'total_value': this.total_value = new FormControl<number | null>(null, []),
          'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
          'book_fk': this.book_fk = new FormControl<number | null>(null, [Validators.required]),
          'sanad_kid_book': this.sanad_kid_book = new FormControl<sanad_kid_book | null>(null, []),
          'branch_fk': this.branch_fk = new FormControl<number | null>(null, []),
          'branch': this.branch = new FormControl<branch | null>(null, []),
          'sanad_kid_details': new FormArray([], [Validators.required]),
          'sanad_kid_attachements': new FormArray([], [])
        },
      );


    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  public SetValue() {

    if (this.Form == null) return;

    if (this.sanad_kid != null &&
      this.sanad_kid.sanad_kid_seq != null)
      this.sanad_kid_seq.setValue(this.sanad_kid?.sanad_kid_seq!);


    if (this.sanad_kid != null &&
      this.sanad_kid.document_date != null
      && moment(this.sanad_kid.document_date).isValid()
    ) {
      this.document_date.setValue(moment(this.sanad_kid.document_date).format("DD-MM-YYYY"));

    }

    if (this.sanad_kid != null &&
      this.sanad_kid.incumbent_date != null &&
      moment(this.sanad_kid.incumbent_date).isValid()
    ) {
      this.incumbent_date.setValue(moment(this.sanad_kid?.incumbent_date).format("DD-MM-YYYY"));
    }


    if (this.sanad_kid != null && this.sanad_kid.document_id != null)
      this.document_id.setValue(this.sanad_kid?.document_id!);


    if (this.sanad_kid != null && this.sanad_kid.incumbent_id != null)
      this.incumbent_id.setValue(this.sanad_kid?.incumbent_id!);


    if (this.sanad_kid != null && this.sanad_kid.book_fk != null)
      this.book_fk.setValue(this.sanad_kid?.book_fk!);


    if (this.sanad_kid != null && this.sanad_kid.sanad_kid_book != null)
      this.sanad_kid_book.setValue(this.sanad_kid?.sanad_kid_book!);


    if (this.sanad_kid != null && this.sanad_kid.name_of_owner != null)
      this.name_of_owner.setValue(this.sanad_kid?.name_of_owner!);

    if (this.sanad_kid != null && this.sanad_kid.total_value != null)
      this.total_value.setValue(this.sanad_kid?.total_value!);

    if (this.sanad_kid != null && this.sanad_kid.sanad_kid_type_fk != null)
      this.sanad_kid_type_fk.setValue(this.sanad_kid?.sanad_kid_type_fk!);

    if (this.sanad_kid != null && this.sanad_kid.branch_fk != null)
      this.branch_fk.setValue(this.sanad_kid?.branch_fk!);


    if (this.sanad_kid != null && this.sanad_kid.branch != null)
      this.branch.setValue(this.sanad_kid?.branch!);


    this.focusNext('document_date');
  }

  getValue() {

    this.total_value.setValue(this.sum_details_debtor());
    this.sanad_kid.total_value = this.total_value.value!;

    if (this.document_date.value != null &&
      moment(this.document_date.value).isValid()
    )
      this.sanad_kid.document_date = moment(this.document_date.value).toDate();


    if (this.incumbent_date.value != null &&
      moment(this.incumbent_date.value).isValid())
      this.sanad_kid.incumbent_date = moment(this.incumbent_date.value).toDate();

    this.sanad_kid.document_id = this.document_id.value!;
    this.sanad_kid.incumbent_id = this.incumbent_id.value!;

    this.sanad_kid.book_fk = this.book_fk.value!;
    this.sanad_kid.sanad_kid_book = this.sanad_kid_book.value!;
    this.sanad_kid.sanad_kid_type_fk = this.sanad_kid_type_fk.value!;
    this.sanad_kid.branch = this.branch.value!;
    this.sanad_kid.branch_fk = this.branch_fk.value!;
    this.sanad_kid.name_of_owner = this.name_of_owner.value!;
    this.sanad_kid.total_value = this.total_value.value!;

    if (this.sanad_kid != null &&
      this.sanad_kid.sanad_kid_attachements != null &&
      this.sanad_kid.sanad_kid_attachements.length > 0)
      this.sanad_kid.sanad_kid_attachements.forEach(element => {
        if (element.attachement_date != null &&
          moment(element.attachement_date).isValid()) {
          element.attachement_date = moment(element.attachement_date).toDate();
        }


      });


  }

  clear() {
    try {
      if (this.Form != null) {
        this.Form.reset();
        this.get_detail_formarray().clear();
        this.get_attachments_formarray().clear();
        this.focusNext('document_date');
      }
    } catch { }



  }

  focusNext(id: string) {
    let element = this._document.getElementById(id);

    if (element != null && element.tagName != null && element.tagName.toLowerCase() == 'ng-select') {
      var elements = element?.firstElementChild?.firstElementChild?.lastElementChild?.getElementsByTagName('input');
      if (elements != null && elements.length > 0) {
        var inputSearchElement = elements.item(0);
        if (inputSearchElement != null) {
          inputSearchElement.focus();
        }

      }

    } else if (element) {
      element.focus();
    }



  }









  Payment_Safe_Check(sanad_kid_detail: sanad_kid_detail): boolean {
    if (this.List_Payment_Safe != null) {
      var Result = this.List_Payment_Safe.filter(x => x.accounts_tree_fk == sanad_kid_detail.accounts_tree_fk);
      if (Result != null && Result.length > 0)
        return true;
    }
    return false;

  }

  Add_Account_Tree_Payment_Safe_To_Details(): boolean {

    if (this.book_fk != null && this.book_fk.value != null && this.book_fk.value > 0) {

      var Results = this.List_sanad_kid_book.filter(x => x.sanad_kid_book_seq == this.book_fk.value);
      if (Results != null && Results.length > 0) {
        var sanad_kid_book = Results[0];
        var sum_debtor = this.sum_details_debtor();
        var sum_creditor = this.sum_details_creditor();


        if (sum_debtor - sum_creditor > 0) {
          let sanad_kid_detail: sanad_kid_detail = {
            account_center_fk: undefined,
            accounts_tree_fk: sanad_kid_book.cash_account_fk,
            creditor: sum_debtor - sum_creditor,
            debtor: 0,
            account_notice: 'اضافة حساب الصندوق للموازنة'
          }
          let index = this.sanad_kid.sanad_kid_details?.length;
          this.sanad_kid.sanad_kid_details?.push(sanad_kid_detail);
          if (index != null && index >= 0)
            this.get_detail_formarray()?.push(this.add_detail(sanad_kid_detail, index));
          return true;
        } else return false;

      }

    } return true;
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
          this.sanad_kid.sanad_kid_details?.splice(index, 1);
          this.get_detail_controls()?.splice(index, 1);
        });
      }





    }
  }



  select_book_option(event: any) {

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


  delete_detail(index: number) {
    this.sanad_kid.sanad_kid_details?.splice(index, 1);
    this.get_detail_formarray()?.controls.splice(index, 1);

    this.update_details_data();
  }






  vaidate_details() {


  }

  save_as_draft() {

    this.sanad_kid_type_fk.setValue(2);



    this.Reomve_Account_Tree_Payment_Safe_From_Details();

    var result_add = this.Add_Account_Tree_Payment_Safe_To_Details();
    if (result_add != true) {
      this.snackBar.open('يوجد خطأ في التفاصيل', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
      });
      return;

    }

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
    if (this.sanad_kid.sanad_kid_seq != null && this.sanad_kid.sanad_kid_seq > 0) {
      this.SanadKidService.update(this.sanad_kid).subscribe(res => {
        if (res != null && (res as result) != null &&
          (res as result).value != null &&
          (res as result).success) {

          this.OnSaveComplete.emit((res as result).value);



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
      this.SanadKidService.add(this.sanad_kid).subscribe(res => {
        console.log('res', res);
        if (res != null && (res as result) != null && (res as result).success && (res as result).value != null) {

          this.OnSaveComplete.emit((res as result).value);


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

    if (this.sanad_kid.sanad_kid_seq != null && this.sanad_kid.sanad_kid_seq > 0) {
      this.SanadKidService.update(this.sanad_kid).subscribe(res => {

        if (res != null && (res as result) != null && (res as result).success && (res as result).value != null) {

          this.OnSaveComplete.emit((res as result).value);

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
      this.SanadKidService.add(this.sanad_kid).subscribe(res => {
        console.log('res', res);
        if (res != null && (res as result) != null && (res as result).success && (res as result).value != null) {

          this.OnSaveComplete.emit((res as result).value);

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




  bindModelToForm(model: any, form: FormGroup, index: number) {
    if (model == null || form == null)
      return;
    const keys = Object.keys(form.controls);
    keys.forEach(key => {

      form.controls[key].valueChanges.subscribe(
        (newValue) => {
          console.log('نمط المعطيات');
          console.log(typeof model[key]);
          if (newValue != null && typeof model[key] === "number") {
            model[key] = +newValue;
          } else if (newValue != null && typeof model[key] === "string") {
            model[key] = newValue.toString();
          } else if (newValue != null && typeof model[key] === "object" && key.includes('date')) {
            if (moment(newValue.toString()).isValid())
              model[key] = moment(newValue.toString()).toDate();
          } else if (newValue != null && typeof model[key] === "object" && !key.includes('date')) {
            model[key] = newValue;
          } else {
            model[key] = newValue;
          }


          this.update_details_data();
          this.update_attachenets_data();

        })
    });





  }


  ///////////////////////////////////
  //detais
  ////////////////////////////////////

  public get_detail_formarray(): FormArray {
    return this.Form.get('sanad_kid_details') as FormArray;
  }

  public get_detail_controls() {
    console.log(this.get_detail_formarray()?.controls);
    return this.get_detail_formarray()?.controls;
  }

  public add_detail(sanad_kid_detail: sanad_kid_detail, index: number): FormGroup {
    var FromGroup = new FormGroup({
      'index': new FormControl<number | null | undefined>(index, [Validators.required]),
      'seq': new FormControl<number | null | undefined | undefined>(sanad_kid_detail.seq, [Validators.required]),
      'sanad_kid_fk': new FormControl<number | null | undefined | undefined>(sanad_kid_detail.sanad_kid_fk, [Validators.required]),
      'debtor': new FormControl<number | null | undefined>(sanad_kid_detail.debtor, []),
      'creditor': new FormControl<number | null | undefined>(sanad_kid_detail.creditor, []),
      'accounts_tree_fk': new FormControl<number | null | undefined>(sanad_kid_detail.accounts_tree_fk, [Validators.required]),
      'accounts_tree': new FormControl<accounts_tree | null | undefined>(sanad_kid_detail.accounts_tree, []),
      'account_center_fk': new FormControl<number | null | undefined>(sanad_kid_detail.account_center_fk, []),
      'account_center': new FormControl<account_center | null | undefined>(sanad_kid_detail.account_center, []),
      'account_notice': new FormControl<string | null | undefined>(sanad_kid_detail.account_notice, [])
    });

    FromGroup.controls['accounts_tree_fk'].setAsyncValidators([validate_account_tree(this.get_detail_formarray().value)])

    FromGroup.controls['accounts_tree_fk'].setAsyncValidators([validate_account_center(this.get_detail_formarray().value, this.AccountTreeService)])


    if (this.sanad_kid.sanad_kid_details != null &&
      index >= 0)
      this.bindModelToForm(this.sanad_kid.sanad_kid_details[index], FromGroup, index);




    return FromGroup;
  }

  public add_empty_detail(index: number): FormGroup {
    var formGroup = new FormGroup({
      'index': new FormControl<number | null | undefined>(index, []),
      'seq': new FormControl<number | null | undefined>(null, []),
      'sanad_kid_fk': new FormControl<number | null | undefined>(null, []),
      'debtor': new FormControl<number | null | undefined>(null, []),
      'creditor': new FormControl<number | null | undefined>(null, []),
      'accounts_tree_fk': new FormControl<number | null | undefined>(null, [Validators.required]),
      'accounts_tree': new FormControl<accounts_tree | null | undefined>(null, []),
      'account_center_fk': new FormControl<number | null | undefined>(null, []),
      'account_center': new FormControl<account_center | null | undefined>(null, []),
      'account_notice': new FormControl<string | null | undefined>(null, [])


    });

    formGroup.controls['accounts_tree_fk'].setAsyncValidators([validate_account_tree(this.get_detail_formarray().value)])

    formGroup.controls['accounts_tree_fk'].setAsyncValidators([validate_account_center(this.get_detail_formarray().value, this.AccountTreeService)])

    if (this.sanad_kid.sanad_kid_details != null &&
      this.sanad_kid.sanad_kid_details.length > index &&
      index >= 0)
      this.bindModelToForm(this.sanad_kid.sanad_kid_details[index], formGroup, index);


    return formGroup;
  }

  new_detail() {
    var index = this.sanad_kid.sanad_kid_details?.length;
    this.sanad_kid.sanad_kid_details?.push({});
    if (index != null && index >= 0)
      this.get_detail_formarray().push(this.add_empty_detail(index));
    this.update_details_data();
  }


  update_details_data() {

    if (this.sanad_kid == null ||
      this.sanad_kid.sanad_kid_details == null ||
      this.sanad_kid.sanad_kid_details.length == 0)
      return;




    this.sum_details_debtor();
    this.sum_details_creditor();
    this.balance = this.sum_details_creditor() - this.sum_details_debtor();

    this.Length_details = this.sanad_kid.sanad_kid_details?.length!;

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

        this.safe_detail = this.sanad_kid.sanad_kid_details[indexFound[0]];

      }





    }
  }




  sum_details_debtor(): number {
    this.sumDebtor = 0;
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
    this.sumCreditor = 0;

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

  ///////////////////////////////////
  //attachment
  ////////////////////////////////////

  new_attachment() {
    var index = this.sanad_kid.sanad_kid_attachements?.length;
    this.sanad_kid.sanad_kid_attachements?.push({});
    if (index != null && index >= 0)
      this.get_attachments_formarray().push(this.add_empty_attachment(index));
  }


  delete_attachment(index: number) {
    this.sanad_kid.sanad_kid_attachements?.splice(index, 1);
    this.get_attachments_controls()?.splice(index, 1);

    this.update_attachenets_data();


  }

  public add_empty_attachment(index: number): FormGroup {
    var formGroup = new FormGroup({
      'index': new FormControl<number | null | undefined>(index, []),
      'attachement_seq': new FormControl<number | null | undefined>(null, []),
      'attachement_id': new FormControl<number | null | undefined>(null, []),
      'attachement_date': new FormControl<string | null | undefined>(null, []),
      'type_fk': new FormControl<number | null | undefined>(null, []),
      'attachement_type': new FormControl<attachement_type | null | undefined>(null, [Validators.required]),
      'attachement_note': new FormControl<string | null | undefined>(null, []),
      'ownership': new FormControl<string | null | undefined>(null, []),
      'source_number': new FormControl<string | null | undefined>(null, []),



    });



    if (this.sanad_kid.sanad_kid_attachements != null &&
      index >= 0)
      this.bindModelToForm(this.sanad_kid.sanad_kid_attachements[index], formGroup, index);


    return formGroup;
  }

  moment_date(date: Date | string | undefined) {
    if (date != null && moment(date).isValid())
      return moment(date).format("DD-MM-YYYY");
    return undefined;
  }

  public add_attachment(sanad_kid_attachement: sanad_kid_attachement, index: number): FormGroup {
    var formGroup = new FormGroup({
      'index': new FormControl<number | null | undefined>(index, []),
      'attachement_seq': new FormControl<number | null | undefined>(sanad_kid_attachement.attachement_seq, []),
      'attachement_id': new FormControl<number | null | undefined>(sanad_kid_attachement.attachement_id, []),
      'attachement_date': new FormControl<string | null | undefined>(this.moment_date(sanad_kid_attachement.attachement_date), []),
      'type_fk': new FormControl<number | null | undefined>(sanad_kid_attachement.type_fk, []),
      'attachement_type': new FormControl<attachement_type | null | undefined>(sanad_kid_attachement.attachement_type, [Validators.required]),
      'attachement_note': new FormControl<string | null | undefined>(sanad_kid_attachement.attachement_note, []),
      'ownership': new FormControl<string | null | undefined>(sanad_kid_attachement.ownership, []),
      'source_number': new FormControl<string | null | undefined>(sanad_kid_attachement.source_number, []),
    });

    if (this.sanad_kid.sanad_kid_attachements != null &&
      this.sanad_kid.sanad_kid_attachements.length > index &&
      index >= 0)
      this.bindModelToForm(this.sanad_kid.sanad_kid_attachements[index], formGroup, index);
    return formGroup;
  }

  public get_attachments_formarray(): FormArray {
    return this.Form.get('sanad_kid_attachements') as FormArray;
  }

  public get_attachments_controls() {
    return this.get_attachments_formarray()?.controls;
  }

  update_attachenets_data() {

    if (this.sanad_kid == null ||
      this.sanad_kid.sanad_kid_attachements == null ||
      this.sanad_kid.sanad_kid_attachements.length == 0)
      return;

    this.Length_attachements = this.sanad_kid.sanad_kid_attachements?.length!;
  }


  onselect_book_fk(sanad_kid_book_seq: any) {

    if (sanad_kid_book_seq != null) {

      var books = this.List_sanad_kid_book.filter(x => x.sanad_kid_book_seq == sanad_kid_book_seq);
      if (books != null && books.length > 0 && books[0].branch_fk != null) {


        this.generate_document_id(books[0]);
        this.generate_incumbent_id(books[0]);


        this.branch_fk.setValue(books[0].branch_fk);
        this.sanad_kid_book.setValue(books[0]);
        this.sanad_kid.sanad_kid_book = books[0];
      }

    }

  }

  public generate_document_id(sanad_kid_book: sanad_kid_book) {
    if (this.sanad_kid.sanad_kid_seq == null ||
      this.sanad_kid.sanad_kid_seq == undefined) {
      if (sanad_kid_book.incumbent_id_generate_type_fk != null &&
        sanad_kid_book.incumbent_id_generate_type_fk > 0 &&
        sanad_kid_book.incumbent_id_generate_type_fk == 1
      ) {

        this.SanadKidService.generate_document_id(sanad_kid_book.incumbent_id_generate_type_fk, 0)
          .subscribe(
            result => {
              if (result != null && result.value != null && result.value > 0)
                this.document_id.setValue(result.value);

            }
          )
      } else if (sanad_kid_book.incumbent_id_generate_type_fk != null &&
        sanad_kid_book.incumbent_id_generate_type_fk > 0 &&
        sanad_kid_book.incumbent_id_generate_type_fk == 2 &&
        this.document_date.value != null &&
        moment(this.document_date.value).isValid()
      ) {
        this.SanadKidService.generate_document_id(sanad_kid_book.incumbent_id_generate_type_fk, moment(this.document_date.value).month())
          .subscribe(
            result => {
              if (result != null && result.value != null && result.value > 0)
                this.document_id.setValue(result.value);

            }
          );

      }



    }
  }

  public generate_incumbent_id(sanad_kid_book: sanad_kid_book) {
    if (this.sanad_kid.sanad_kid_seq == null ||
      this.sanad_kid.sanad_kid_seq == undefined) {
      if (sanad_kid_book.incumbent_id_generate_type_fk != null &&
        sanad_kid_book.incumbent_id_generate_type_fk > 0 &&
        sanad_kid_book.incumbent_id_generate_type_fk == 1
      ) {

        this.SanadKidService.generate_incumbent_id(sanad_kid_book.incumbent_id_generate_type_fk, 0)
          .subscribe(
            result => {
              if (result != null && result.value != null && result.value > 0)
                this.incumbent_id.setValue(result.value);

            }
          )
      } else if (sanad_kid_book.incumbent_id_generate_type_fk != null &&
        sanad_kid_book.incumbent_id_generate_type_fk > 0 &&
        sanad_kid_book.incumbent_id_generate_type_fk == 2 &&
        this.incumbent_date.value != null &&
        moment(this.incumbent_date.value).isValid()
      ) {
        this.SanadKidService.generate_incumbent_id(sanad_kid_book.incumbent_id_generate_type_fk, moment(this.incumbent_date.value).month())
          .subscribe(
            result => {
              if (result != null && result.value != null && result.value > 0)
                this.incumbent_id.setValue(result.value);

            }
          );

      }



    }
  }


}
