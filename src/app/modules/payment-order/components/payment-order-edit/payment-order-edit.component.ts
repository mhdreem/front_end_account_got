import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { branch } from 'src/app/modules/shared/models/branch';
import { payment_order } from 'src/app/modules/shared/models/payment_order';
import { payment_order_entry } from 'src/app/modules/shared/models/payment_order_entry';
import { result } from 'src/app/modules/shared/models/result';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { PaymentOrderService } from 'src/app/modules/shared/services/payment-order.service';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { PagePaymentOrderService } from '../../pageservice/page-payment-order.service';

@Component({
  selector: 'app-payment-order-edit',
  templateUrl: './payment-order-edit.component.html',
  styleUrls: ['./payment-order-edit.component.scss']
})
export class PaymentOrderEditComponent {
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


  get payment_order(): payment_order {
    if (
      this.PagePaymentOrderService.payment_order != null) {
      return this.PagePaymentOrderService.payment_order;
    }
    return {};
  }

  set payment_order(obj: payment_order) {
    this.PagePaymentOrderService.payment_order = obj;
    this.SetValue();
  }


  _Subscription: Subscription = new Subscription;

  Form!: FormGroup;
  payment_order_seq!: FormControl<number | null>;
  sanad_kid_fk!: FormControl<number | null>;
  document_id!: FormControl<number | null>;
  document_date!: FormControl<Date | null>;
  incumbent_id!: FormControl<number | null>;
  incumbent_date!: FormControl<Date | null>;
  payment_order_type_fk!: FormControl<number | null>;
  total_value: FormControl<number | null>;
  name_of_owner: FormControl<string | null>;
  book_fk: FormControl<number | null>;
  sanad_kid_book: FormControl<sanad_kid_book | null>;
  branch_fk: FormControl<number | null>;
  branch: FormControl<branch | null>;


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

  dataSource_payment_order_entry = new MatTableDataSource<payment_order_entry>();
  payment_order_entry_displayedColumns: string[] =
    ["pay_ord_stg_name", 'user_entry', 'date_entry'];

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private PagePaymentOrderService: PagePaymentOrderService,
    private snackBar: MatSnackBar,
    private SanadKidBookService: SanadKidBookService,
    @Inject(DOCUMENT) private _document: Document,
    private paymentOrderService: PaymentOrderService
  ) {

    this.LoadingFinish = true;

    this.BuildForm();

    this.loadData();

    if (this.payment_order != null && 
      this.payment_order.payment_order_entries!= null)
      this.dataSource_payment_order_entry.data = this.payment_order.payment_order_entries!;

  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  ngOnInit() {
    this.PagePaymentOrderService.new();

    let seq: number = this.route.snapshot.params['id'];
    if (seq != null && seq > 0) {
      this._Subscription.add(this.paymentOrderService.getBySeq(seq).subscribe((res: any) => {
        if (res.value != null && (res.value as payment_order) != null) {
          this.payment_order = res.value;
        }
      }));


    }
    else{
      this.payment_order= {};
      this.payment_order.payment_order_details= [];
      this.payment_order.payment_order_attachements= [];
    }


  }

  ngAfterViewInit() {
    this.dataSource_payment_order_entry.paginator = this.paginator;
    this.dataSource_payment_order_entry.sort = this.sort;
  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'payment_order_seq': this.payment_order_seq = new FormControl<number | null>(null, []),// Primary Key
          'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, []),
          'document_id': this.document_id = new FormControl<number | null>(null, [Validators.required]),
          'document_date': this.document_date = new FormControl<Date | null>(null, [Validators.required]),
          'incumbent_id': this.incumbent_id = new FormControl<number | null>(null, []),
          'incumbent_date': this.incumbent_date = new FormControl<Date | null>(null, []),
          'payment_order_type_fk': this.payment_order_type_fk = new FormControl<number | null>(null, []),
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


  loadData() {
    this._Subscription.add
      (
        forkJoin(
          this.load_sanad_kid_book()

        ).subscribe(
          res => {

            this.List_sanad_kid_book = res[0];
            this.filter_List_sanad_kid_book = of(res[0]);
            this.SanadKidBookService.List_SanadKidBook = res[0];
            this.SanadKidBookService.List_SanadKidBook_BehaviorSubject.next(res[0]);


            this.Init_AutoComplete();
          }
        )
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

    
    if (this.payment_order != null && this.payment_order.payment_order_seq != null)
    this.payment_order_seq.setValue(this.payment_order?.payment_order_seq!);


    if (this.payment_order != null && this.payment_order.document_date != null) {
      this.document_date.setValue(this.payment_order.document_date);
      this.sanadDateDay = moment(this.document_date.value).date() + '';
      this.sanadDateMonth = (moment(this.document_date.value).month() + 1) + '';
      this.sanadDateYear = moment(this.document_date.value).year() + '';
      this.sanadDateDayIsFilled = true;
      this.sanadDateMonthIsFilled = true;
      this.sanadDateYearIsFilled = true;
    }

    if (this.payment_order != null && this.payment_order.incumbent_date != null){
      this.incumbent_date.setValue(this.payment_order?.incumbent_date!);
    this.incumbentDateDay = moment(this.incumbent_date.value).date() + '';
    this.incumbentDateMonth = (moment(this.incumbent_date.value).month() + 1) + '';
    this.incumbentDateYear = moment(this.incumbent_date.value).year() + '';
    this.incumbentDateDayIsFilled = true;
    this.incumbentDateMonthIsFilled = true;
    this.incumbentDateYearIsFilled = true;
    }


    if (this.payment_order != null && this.payment_order.document_id != null)
      this.document_id.setValue(this.payment_order?.document_id!);


    if (this.payment_order != null && this.payment_order.incumbent_id != null)
      this.incumbent_id.setValue(this.payment_order?.incumbent_id!);


      if (this.payment_order != null && this.payment_order.book_fk != null)
      this.book_fk.setValue(this.payment_order?.book_fk!);


      if (this.payment_order != null && this.payment_order.sanad_kid_book != null)
      this.sanad_kid_book.setValue(this.payment_order?.sanad_kid_book!);


    if (this.payment_order != null && this.payment_order.name_of_owner != null)
      this.name_of_owner.setValue(this.payment_order?.name_of_owner!);

    if (this.payment_order != null && this.payment_order.total_value != null)
      this.total_value.setValue(this.payment_order?.total_value!);
    
    if (this.payment_order != null && this.payment_order.payment_order_type_fk != null)
      this.payment_order_type_fk.setValue(this.payment_order?.payment_order_type_fk!);

    if (this.payment_order != null && this.payment_order.branch_fk != null)
      this.branch_fk.setValue(this.payment_order?.branch_fk!);


    if (this.payment_order != null && this.payment_order.branch != null)
      this.branch.setValue(this.payment_order?.branch!);

    if (this.payment_order != null && this.payment_order.sanad_kid_fk != null)
      this.sanad_kid_fk.setValue(this.payment_order?.sanad_kid_fk!);


      
  }

  getValue() {

    this.total_value.setValue(this.sum_details_debtor());
    this.payment_order.total_value= this.total_value.value!;

    this.payment_order.document_date = moment(this.sanadDateMonth + '/' + this.sanadDateDay + '/' + this.sanadDateYear).set({ hour: 4 }).toDate();
   
    this.payment_order.incumbent_date = moment(this.incumbentDateMonth + '/' + this.incumbentDateDay + '/' + this.incumbentDateYear).set({ hour: 4 }).toDate();

    this.payment_order.document_id = this.document_id.value!;
    this.payment_order.incumbent_id = this.incumbent_id.value!;

    this.payment_order.book_fk = this.book_fk.value!;
    this.payment_order.sanad_kid_book = this.sanad_kid_book.value!;
    this.payment_order.payment_order_type_fk= this.payment_order_type_fk.value!;

    this.payment_order.branch = this.branch.value!;
    this.payment_order.branch_fk = this.branch_fk.value!;



    

    this.payment_order.name_of_owner = this.name_of_owner.value!;
    
    this.payment_order.total_value = this.total_value.value!;




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
    this.payment_order.payment_order_attachements?.push({ payment_order_fk: this.payment_order.payment_order_seq });
    }
 

  onAttachmentDelete(index: number) {
    this.getValue();
    this.payment_order.payment_order_attachements?.splice(index, 1);
  }


  onDetailsDelete(index: number) {
    this.sum_details_creditor();
    this.sum_details_debtor();    
    this.payment_order.payment_order_details?.splice(index, 1);
  }


  addDetails() {
    this.payment_order.payment_order_details?.push({ payment_order_fk: this.payment_order.payment_order_seq });  
    this.sum_details_creditor();
    this.sum_details_debtor();
  }



  select_Book_Option(event: any) {

    const selectedValue = event.option.value;

    if (selectedValue != null) {

      var books = this.List_sanad_kid_book.filter(x => x.sanad_kid_book_seq == selectedValue);
      if (books != null && books.length > 0 && books[0].branch_fk != null) {
        this.selected_sanad_kid_book = books[0];
        this.branch_fk.setValue(books[0].branch_fk);
        if (books[0].branch!= null)
          this.branch.setValue(books[0].branch);


      }

    }

  }


  sum_details_debtor():number
  {
    if (this.payment_order!= null &&
      this.payment_order.payment_order_details!= null &&
      this.payment_order.payment_order_details.length>0)
      {

        let sum:number =0;
         this.payment_order.payment_order_details.forEach(element => {
           if (element.debtor!= null )  sum = sum  + (+element.debtor);  
         }); 

        return sum;

      }

      return 0;


  }

  sum_details_creditor():number
  {
    if (this.payment_order!= null &&
      this.payment_order.payment_order_details!= null &&
      this.payment_order.payment_order_details.length>0)
      {

        let sum:number =0;
         this.payment_order.payment_order_details.forEach(element => {
           if (element.creditor!= null )  sum = sum  + (+element.creditor);  
         }); 
         
        return sum;

      }
      return 0;
  }

  vaidate_details()
  {


  }

  save_as_draft() {

    this.payment_order_type_fk.setValue(2);

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
    if (this.payment_order.payment_order_seq != null && this.payment_order.payment_order_seq > 0) {
      this.paymentOrderService.update(this.payment_order).subscribe(res => {
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
      console.log('this.exchange_order', this.payment_order);
      this.paymentOrderService.add(this.payment_order).subscribe(res => {
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

    this.payment_order_type_fk.setValue(1);
    
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
    if (this.payment_order.payment_order_seq != null && this.payment_order.payment_order_seq > 0) {
      this.paymentOrderService.update(this.payment_order).subscribe(res => {
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
      console.log('this.exchange_order', this.payment_order);
      this.paymentOrderService.add(this.payment_order).subscribe(res => {
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

}
