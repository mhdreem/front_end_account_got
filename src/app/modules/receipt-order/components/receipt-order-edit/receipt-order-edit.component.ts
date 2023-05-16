import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { combineLatest, forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { branch } from 'src/app/modules/shared/models/branch';
import { receipt_order } from 'src/app/modules/shared/models/receipt_order';
import { receipt_order_entry } from 'src/app/modules/shared/models/receipt_order_entry';
import { result } from 'src/app/modules/shared/models/result';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { ReceiptOrderService } from 'src/app/modules/shared/services/receipt-order.service';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { PageReceiptOrderService } from '../../pageservice/page-receipt-order.service';
import { payment_safe } from 'src/app/modules/shared/models/payment_safe';
import { PaymentSafeService } from 'src/app/modules/shared/services/payment_safe.service';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { receipt_order_detail } from 'src/app/modules/shared/models/receipt_order_detail';


@Component({
  selector: 'app-receipt-order-edit',
  templateUrl: './receipt-order-edit.component.html',
  styleUrls: ['./receipt-order-edit.component.scss']
})
export class ReceiptOrderEditComponent implements OnDestroy, OnInit, AfterViewInit{


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 120) {
      event.preventDefault();
      this.save();
    }

    if (event.keyCode == 114) {
      event.preventDefault();
    
    }
  }


  _receipt_order: receipt_order;

  get receipt_order(): receipt_order {
    return this._receipt_order;
  }

  set receipt_order(obj: receipt_order) {
    this._receipt_order = obj;
    this.SetValue();
  }


  


  _Subscription: Subscription[] = [];

  Form!: FormGroup;
  receipt_order_seq!: FormControl<number | null>;
  sanad_kid_fk!: FormControl<number | null>;
  document_id!: FormControl<number | null>;
  document_date!: FormControl<Date | null>;
  incumbent_id!: FormControl<number | null>;
  incumbent_date!: FormControl<Date | null>;
  receipt_order_type_fk!: FormControl<number | null>;
  total_value: FormControl<number | null>;
  name_of_owner: FormControl<string | null>;
  book_fk: FormControl<number | null>;
  sanad_kid_book: FormControl<sanad_kid_book | null>;
  branch_fk: FormControl<number | null>;
  branch: FormControl<branch | null>;


  selected_sanad_kid_book: sanad_kid_book;
  List_Payment_Safe: payment_safe[] = [];
  list_branch: branch[] = [];
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

  dataSource_receipt_order_entry = new MatTableDataSource<receipt_order_entry>();
  receipt_order_entry_displayedColumns: string[] =
    ["ex_ord_stg_name", 'user_entry', 'date_entry'];

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sumCreditor: number= 0;
  sumDebtor: number= 0;
  balance: number= 0;
  actionNum: number= 0;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private PageReceiptOrderService: PageReceiptOrderService,
    private snackBar: MatSnackBar,
    private SanadKidBookService: SanadKidBookService,
    @Inject(DOCUMENT) private _document: Document,
    private receiptOrderService: ReceiptOrderService,
    private PaymentSafeService: PaymentSafeService,
    private BranchService: BranchService,
  ) {

    this.LoadingFinish = true;

    this.BuildForm();

    this.loadData();

    this.PageReceiptOrderService.$receipt_order.subscribe(res=>{
      this.receipt_order= res;
      this.updateSum();
      this.actionNum= this.receipt_order.receipt_order_details?.length!;
    });

    if (this.receipt_order != null && 
      this.receipt_order.receipt_order_entries!= null)
      this.dataSource_receipt_order_entry.data = this.receipt_order.receipt_order_entries!;

  }

  ngOnDestroy(): void {
    this._Subscription.forEach(Sub => {
      if (Sub != null) Sub.unsubscribe();
    });
  }


  public Load_Receipt_Order(receipt_order_seq: number | number | undefined): Observable<result> {
    if (receipt_order_seq == null ||
      receipt_order_seq == undefined ||
      receipt_order_seq == 0) {
        this.receipt_order= {};
        this.receipt_order.receipt_order_details= [];
        this.receipt_order.receipt_order_attachements= [];
        this.Form.reset();
          this.dataSource_receipt_order_entry.data= [];
          this.sumDebtor= 0;
          this.sumCreditor= 0;
          this.balance= 0;
          this.sanadDateDay= '';
          this.sanadDateMonth= '';
          this.sanadDateYear= '';
          this.incumbentDateDay= '';
          this.incumbentDateMonth= '';
          this.incumbentDateYear= '';
  
          this.sanadDateDayIsFilled= false;
          this.sanadDateMonthIsFilled= false;
          this.sanadDateYearIsFilled= false;
          this.incumbentDateDayIsFilled= false;
          this.incumbentDateMonthIsFilled= false;
          this.incumbentDateYearIsFilled= false;
          let result: result = {
            value: this.receipt_order,
            error: '',
            success: true
          }
      return of(result);
    }

    return this.receiptOrderService.getBySeq(receipt_order_seq);
  }


  ngOnInit() {
    /*
    this.PageReceiptOrderService.new();

    let seq: number = this.route.snapshot.params['id'];
    if (seq != null && seq > 0) {
      this._Subscription.add(this.receiptOrderService.getBySeq(seq).subscribe((res: any) => {
        if (res.value != null && (res.value as receipt_order) != null) {
          this.PageReceiptOrderService.set(res.value);
          this.updateSum();
          this.actionNum= this.receipt_order.receipt_order_details?.length!;

        }
      }));


    }
    else{
      
    }

 */
  }

  ngAfterViewInit() {
    this.dataSource_receipt_order_entry.paginator = this.paginator;
    this.dataSource_receipt_order_entry.sort = this.sort;

    setTimeout(()=>{
      document.querySelector('c-sidebar')?.classList.add('hide');
    }, 1000);
   
  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'receipt_order_seq': this.receipt_order_seq = new FormControl<number | null>(null, []),// Primary Key
          'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, []),
          'document_id': this.document_id = new FormControl<number | null>(null, [Validators.required]),
          'document_date': this.document_date = new FormControl<Date | null>(null, [Validators.required]),
          'incumbent_id': this.incumbent_id = new FormControl<number | null>(null, []),
          'incumbent_date': this.incumbent_date = new FormControl<Date | null>(null, []),
          'receipt_order_type_fk': this.receipt_order_type_fk = new FormControl<number | null>(null, []),
          'total_value': this.total_value = new FormControl<number | null>(null, []),
          'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
          'book_fk': this.book_fk = new FormControl<number | null>(null, [Validators.required]),
          'sanad_kid_book': this.sanad_kid_book = new FormControl<sanad_kid_book | null>(null, []),
          'branch_fk': this.branch_fk = new FormControl<number | null>(null, []),
          'branch': this.branch = new FormControl<branch | null>(null, []),

        },
      );


    } catch (Exception: any) {
      console.log(Exception);
    }
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



  

  loadData() {

    
    combineLatest(this.PageReceiptOrderService.$receipt_order).subscribe(
      res => {
        this.receipt_order = res[0];
        let receipt_order_seq: number | undefined | null = res[0]?.receipt_order_seq;

        this.updateSum();
        this.actionNum = this.receipt_order.receipt_order_details?.length!;

        
    this._Subscription.push
      (
        forkJoin(
          this.load_sanad_kid_book(),
          this.Load_Payment_Safe(),
          this.Load_Branch(),
          this.Load_Receipt_Order(receipt_order_seq)
         
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
              this.receipt_order = res[3].value;

            this.updateSum();

            this.actionNum = this.receipt_order.receipt_order_details?.length!;

            if (this.receipt_order != null &&
              this.receipt_order.receipt_order_entries != null) {
              this.dataSource_receipt_order_entry.data = this.receipt_order.receipt_order_entries!;
            }

            this.Init_AutoComplete();
          }
        )
      );
    }
    );
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




  rowClicked!: number;
  changeTableRowColor(idx: any) {
    if (this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }


  public SetValue() {

    
    if (this.receipt_order != null && this.receipt_order.receipt_order_seq != null)
    this.receipt_order_seq.setValue(this.receipt_order?.receipt_order_seq!);


    if (this.receipt_order != null && this.receipt_order.document_date != null) {
      this.document_date.setValue(this.receipt_order.document_date);
      this.sanadDateDay = moment(this.document_date.value).date() + '';
      this.sanadDateMonth = (moment(this.document_date.value).month() + 1) + '';
      this.sanadDateYear = moment(this.document_date.value).year() + '';
      this.sanadDateDayIsFilled = true;
      this.sanadDateMonthIsFilled = true;
      this.sanadDateYearIsFilled = true;
    }

    if (this.receipt_order != null && this.receipt_order.incumbent_date != null){
      this.incumbent_date.setValue(this.receipt_order?.incumbent_date!);
    this.incumbentDateDay = moment(this.incumbent_date.value).date() + '';
    this.incumbentDateMonth = (moment(this.incumbent_date.value).month() + 1) + '';
    this.incumbentDateYear = moment(this.incumbent_date.value).year() + '';
    this.incumbentDateDayIsFilled = true;
    this.incumbentDateMonthIsFilled = true;
    this.incumbentDateYearIsFilled = true;
    }


    if (this.receipt_order != null && this.receipt_order.document_id != null)
      this.document_id.setValue(this.receipt_order?.document_id!);


    if (this.receipt_order != null && this.receipt_order.incumbent_id != null)
      this.incumbent_id.setValue(this.receipt_order?.incumbent_id!);


      if (this.receipt_order != null && this.receipt_order.book_fk != null)
      this.book_fk.setValue(this.receipt_order?.book_fk!);


      if (this.receipt_order != null && this.receipt_order.sanad_kid_book != null)
      this.sanad_kid_book.setValue(this.receipt_order?.sanad_kid_book!);


    if (this.receipt_order != null && this.receipt_order.name_of_owner != null)
      this.name_of_owner.setValue(this.receipt_order?.name_of_owner!);

    if (this.receipt_order != null && this.receipt_order.total_value != null)
      this.total_value.setValue(this.receipt_order?.total_value!);
    
    if (this.receipt_order != null && this.receipt_order.receipt_order_type_fk != null)
      this.receipt_order_type_fk.setValue(this.receipt_order?.receipt_order_type_fk!);

    if (this.receipt_order != null && this.receipt_order.branch_fk != null)
      this.branch_fk.setValue(this.receipt_order?.branch_fk!);


    if (this.receipt_order != null && this.receipt_order.branch != null)
      this.branch.setValue(this.receipt_order?.branch!);

    if (this.receipt_order != null && this.receipt_order.sanad_kid_fk != null)
      this.sanad_kid_fk.setValue(this.receipt_order?.sanad_kid_fk!);


      
  }

  getValue() {

    this.total_value.setValue(this.sum_details_debtor());
    this.receipt_order.total_value= this.total_value.value!;

    this.receipt_order.document_date = moment(this.sanadDateMonth + '/' + this.sanadDateDay + '/' + this.sanadDateYear).set({ hour: 4 }).toDate();
   
    this.receipt_order.incumbent_date = moment(this.incumbentDateMonth + '/' + this.incumbentDateDay + '/' + this.incumbentDateYear).set({ hour: 4 }).toDate();

    this.receipt_order.document_id = this.document_id.value!;
    this.receipt_order.incumbent_id = this.incumbent_id.value!;

    this.receipt_order.book_fk = this.book_fk.value!;
    this.receipt_order.sanad_kid_book = this.sanad_kid_book.value!;
    this.receipt_order.receipt_order_type_fk= this.receipt_order_type_fk.value!;

    this.receipt_order.branch = this.branch.value!;
    this.receipt_order.branch_fk = this.branch_fk.value!;



    

    this.receipt_order.name_of_owner = this.name_of_owner.value!;
    
    this.receipt_order.total_value = this.total_value.value!;




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







  addAttachment() {
    this.receipt_order.receipt_order_attachements?.push({ receipt_order_fk: this.receipt_order.receipt_order_seq });
    this.PageReceiptOrderService.set(this.receipt_order);
    }
 

  onAttachmentDelete(index: number) {
    this.getValue();
    this.receipt_order.receipt_order_attachements?.splice(index, 1);
    this.PageReceiptOrderService.set(this.receipt_order);

  }


  onDetailsDelete(index: number) {
    this.receipt_order.receipt_order_details?.splice(index, 1);
    this.PageReceiptOrderService.set(this.receipt_order);

    this.sum_details_creditor();
    this.sum_details_debtor();
    this.actionNum= this.receipt_order.receipt_order_details?.length!;

  }


  addDetails() {
    this.receipt_order.receipt_order_details?.push({ receipt_order_fk: this.receipt_order.receipt_order_seq });  
    this.PageReceiptOrderService.set(this.receipt_order);

    this.actionNum= this.receipt_order.receipt_order_details?.length!;
    this.sum_details_creditor();
    this.sum_details_debtor();
  }

  updateSum(){
    this.balance= this.sum_details_creditor()-  this.sum_details_debtor();
  }


  Payment_Safe_Check(receipt_order_detail: receipt_order_detail): boolean {
    if (this.List_Payment_Safe != null) {
      var Result = this.List_Payment_Safe.filter(x => x.accounts_tree_fk == receipt_order_detail.accounts_tree_fk);
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


        if (sum_creditor-sum_debtor>0)
        {
          let receipt_order_detail: receipt_order_detail = {
            account_center_fk: undefined,
            accounts_tree_fk: sanad_kid_book.cash_account_fk,
            creditor: 0,
            debtor: sum_creditor-sum_debtor,
            account_notice: 'اضافة حساب الصندوق للموازنة'
          }
          this.receipt_order.receipt_order_details?.push(receipt_order_detail);
        } 
          
        




      }



      if (
        this.List_Payment_Safe != null &&
        this.List_Payment_Safe.length > 0 &&
        this.receipt_order != null && this.receipt_order.receipt_order_details != null) {
        let indexFound: number[] = [];

        this.receipt_order.receipt_order_details.forEach((det, index) => {
          if (det != null && det.accounts_tree_fk != null) {
            if (this.Payment_Safe_Check(det))
              indexFound.push(index);
          }
        });
        if (indexFound != null &&
          indexFound.length > 0) {
          indexFound.forEach(index => {
            this.receipt_order.receipt_order_details = this.receipt_order.receipt_order_details?.splice(index, 1);
          });
        }


      }


    }
  }


  Reomve_Account_Tree_Payment_Safe_From_Details() {


    if (
      this.List_Payment_Safe != null &&
      this.List_Payment_Safe.length > 0 &&
      this.receipt_order != null &&
      this.receipt_order.receipt_order_details != null &&
      this.receipt_order.receipt_order_details.length > 0) {
      let indexFound: number[] = [];

      this.receipt_order.receipt_order_details.forEach((det, index) => {
        if (det != null && det.accounts_tree_fk != null) {
          if (this.Payment_Safe_Check(det))
            indexFound.push(index);
        }
      });

      if (indexFound != null &&
        indexFound.length > 0) {
        indexFound.forEach(index => {
          this.receipt_order.receipt_order_details = this.receipt_order.receipt_order_details?.splice(index, 1);
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
    if (this.receipt_order != null &&
      this.receipt_order.receipt_order_details != null &&
      this.receipt_order.receipt_order_details.length > 0) {

      let sum: number = 0;
      this.receipt_order.receipt_order_details.forEach(element => {
        if (element.debtor != null) sum = sum + (+element.debtor);
      });

      this.sumDebtor = sum;
      return sum;

    }

    return 0;


  }

  sum_details_creditor(): number {
    if (this.receipt_order != null &&
      this.receipt_order.receipt_order_details != null &&
      this.receipt_order.receipt_order_details.length > 0) {

      let sum: number = 0;
      this.receipt_order.receipt_order_details.forEach(element => {
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

    this.receipt_order_type_fk.setValue(2);

    let Sum_Debt = this.sum_details_debtor();
    let Sum_Creditor = this.sum_details_creditor();
    if ( Sum_Debt!= Sum_Creditor)
    {
      this.snackBar.open('يجب أن يتساوى مجموع الدائن مع مجموع المدين', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
      });
      return ;

    }

    this.getValue();
    if (this.receipt_order.receipt_order_seq != null && this.receipt_order.receipt_order_seq > 0) {
      this.receiptOrderService.update(this.receipt_order).subscribe(res => {
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
      console.log('this.receipt_order', this.receipt_order);
      this.receiptOrderService.add(this.receipt_order).subscribe(res => {
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

    this.receipt_order_type_fk.setValue(1);
    
    let Sum_Debt = this.sum_details_debtor();
    let Sum_Creditor = this.sum_details_creditor();
    if ( Sum_Debt!= Sum_Creditor)
    {

      this.snackBar.open('يجب أن يتساوى مجموع الدائن مع مجموع المدين', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
      });
      return ;

    }

  
    this.getValue();
    if (this.receipt_order.receipt_order_seq != null && this.receipt_order.receipt_order_seq > 0) {
      this.receiptOrderService.update(this.receipt_order).subscribe(res => {
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
      console.log('this.receipt_order', this.receipt_order);
      this.receiptOrderService.add(this.receipt_order).subscribe(res => {
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


  OnSelectItem(receipt_order:receipt_order)
  {

  }

}
