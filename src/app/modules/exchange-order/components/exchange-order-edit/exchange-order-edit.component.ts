import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { exchange_order } from 'src/app/modules/shared/models/exchange_order';
import { exchange_order_entry } from 'src/app/modules/shared/models/exchange_order_entry';
import { result } from 'src/app/modules/shared/models/result';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { ExchangeOrderService } from 'src/app/modules/shared/services/exchange-order.service';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { PageExchangeOrderService } from '../../pageservice/page-exchange-order.service';

@Component({
  selector: 'app-exchange-order-edit',
  templateUrl: './exchange-order-edit.component.html',
  styleUrls: ['./exchange-order-edit.component.scss']
})
export class ExchangeOrderEditComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    if(event.keyCode == 114){
      event.preventDefault();
      this.attachments();
    }
    
  }

  get exchange_order():exchange_order 
  {
    if (
      this.PageExchangeOrderService.exchange_order!= null  )
      { 
        return this.PageExchangeOrderService.exchange_order;
      }
      return {};
  }

  set exchange_order(obj:exchange_order) 
  {
    this.PageExchangeOrderService.exchange_order= obj;
  }

  _Subscription!: Subscription;
 
  Form!: FormGroup;
  sanad_kid_fk!: FormControl<number | null>;
  document_id!: FormControl<number | null>;
  document_date!: FormControl<Date | null>;
<<<<<<< Updated upstream
=======
  operation_type_fk!: FormControl<number | null>;
  operation_code_fk!: FormControl<number | null>;
>>>>>>> Stashed changes
  incumbent_id!: FormControl<number | null>;
  incumbent_date!: FormControl<Date | null>;
  sanad_kid_type_fk!: FormControl<number | null>;
  sanad_total_value: FormControl<number | null>;
  sanad_close: FormControl<boolean | null>;
  name_of_owner: FormControl<string | null>;
  book_fk: FormControl<number | null>;
  
 
  List_sanad_kid_book ?: sanad_kid_book[];
  filter_List_sanad_kid_book ?: Observable<sanad_kid_book[]>;


  sanadDateDay: string= '';
  sanadDateMonth: string= '';
  sanadDateYear: string= '';
  incumbentDateDay: string= '';
  incumbentDateMonth: string= '';
  incumbentDateYear: string= '';

  sanadDateDayIsFilled: boolean= false;
  sanadDateMonthIsFilled: boolean= false;
  sanadDateYearIsFilled: boolean= false;
  incumbentDateDayIsFilled: boolean= false;
  incumbentDateMonthIsFilled: boolean= false;
  incumbentDateYearIsFilled: boolean= false;

  selected_Order: exchange_order= {};

  LoadingFinish : boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource_exchange_order_entry = new MatTableDataSource<exchange_order_entry>();
  displayedColumns: string[] =
   ["ex_ord_stg_name", 'user_entry' ,'date_entry'  ];

   totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private PageExchangeOrderService:PageExchangeOrderService,
    private snackBar: MatSnackBar,
    private SanadKidBookService:SanadKidBookService,
    @Inject(DOCUMENT) private _document: Document,
    private exchangeOrderService: ExchangeOrderService
    ) { 
      this.LoadingFinish = true;
      this.BuildForm();
      this.loadData();      
    }
    
    load_sanad_kid_book():Observable<sanad_kid_book[]>
    {
      if (this.SanadKidBookService.List_sanad_kid_book!= null &&
        this.SanadKidBookService.List_sanad_kid_book.length>0)
        {
          return of (this.SanadKidBookService.List_sanad_kid_book);
        }
     
        return this.SanadKidBookService.list();

    }

    loadData()
    {
      this._Subscription.add
      (
        forkJoin(
          this.load_sanad_kid_book()
  
        ).subscribe(
          res=>
          {
            
            this.List_sanad_kid_book = res[0];
            this.filter_List_sanad_kid_book =  of (res[0]);
            this.SanadKidBookService.List_sanad_kid_book =  res[0];
            this.SanadKidBookService.List_sanad_kid_book_BehaviorSubject.next(res[0]);
  
          }
        )
      );
   
    }

    public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, [Validators.required]),
            'document_id': this.document_id = new FormControl<number | null>(null, [Validators.required]),
<<<<<<< Updated upstream
            'document_date': this.document_date = new FormControl<Date | null>(null, [Validators.required]),           
=======
            'document_date': this.document_date = new FormControl<Date | null>(null, [Validators.required]),
            'operation_type_fk': this.operation_type_fk = new FormControl<number | null>(null, []),
            'operation_code_fk': this.operation_code_fk = new FormControl<number | null>(null, []),
>>>>>>> Stashed changes
            'incumbent_date': this.incumbent_date = new FormControl<Date | null>(null, []),
            'incumbent_id': this.incumbent_id = new FormControl<number | null>(null, []),
            'sanad_close': this.sanad_close = new FormControl<boolean | null>(null, []),
            'sanad_total_value': this.sanad_total_value = new FormControl<number | null>(null, []),
            'sanad_kid_type_fk': this.sanad_kid_type_fk = new FormControl<number | null>(null, []),
            'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
            'book_fk': this.book_fk = new FormControl<number | null>(null, [Validators.required]),
          },
          );
    
        } catch (Exception: any) {
          console.log(Exception);
        }
      }


    ngOnDestroy(): void {
      this._Subscription.unsubscribe();
    }
          
    ngOnInit() { 
      let seq : number = this.route.snapshot.params['seq'];
      if (seq!= null && seq>0){
        this.exchangeOrderService.getBySeq(seq).subscribe(res =>{
          this.selected_Order = res;
          this.exchange_order= this.selected_Order;
          this.SetValue();
        })
      }
      else{
        this.exchange_order= {};
        this.exchange_order.exchange_order_details= [];
        this.exchange_order.exchange_order_attachements= [];
        this.exchange_order.exchange_order_entries= [];
      }

      this.loadEntry();
      //  console.log('this.sanad_kid.sanad_kid_details', this.sanad_kid.sanad_kid_details);
    }

    ngAfterViewInit() {
      this.dataSource_exchange_order_entry.paginator = this.paginator;
      this.dataSource_exchange_order_entry.sort = this.sort;
    }

    rowClicked!: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  loadEntry(){
    this.dataSource_exchange_order_entry.data= this.exchange_order.exchange_order_entries!;
  }

  public SetValue() {
    if (this.selected_Order != null && this.selected_Order.document_date != null){
      this.document_date.setValue(this.selected_Order.document_date);
      this.sanadDateDay= moment(this.document_date.value).date()+'';
      this.sanadDateMonth= moment(this.document_date.value).month()+'';
      this.sanadDateYear= moment(this.document_date.value).year()+'';
    }

    if (this.selected_Order != null && this.selected_Order.incumbent_date != null)
      this.incumbent_date.setValue(this.selected_Order?.incumbent_date!);
      this.incumbentDateDay= moment(this.incumbent_date.value).date()+'';
      this.incumbentDateMonth= moment(this.incumbent_date.value).month()+'';
      this.incumbentDateYear= moment(this.incumbent_date.value).year()+'';


    if (this.selected_Order != null && this.selected_Order.document_id != null)
      this.document_id.setValue(this.selected_Order?.document_id!);

      
    if (this.selected_Order != null && this.selected_Order.incumbent_id != null)
      this.incumbent_id.setValue(this.selected_Order?.incumbent_id!);

    if (this.selected_Order != null && this.selected_Order.name_of_owner != null)
      this.name_of_owner.setValue(this.selected_Order?.name_of_owner!);

    }
  
  getValue(){
  this.selected_Order.document_date= moment(this.sanadDateMonth+'/'+this.sanadDateDay+'/'+this.sanadDateYear).set({hour: 2}).toDate();
  this.selected_Order.incumbent_date= moment(this.incumbentDateMonth+'/'+this.incumbentDateDay+'/'+this.incumbentDateYear).set({hour: 2}).toDate();
  this.selected_Order.document_id= this.document_id.value!;
  this.selected_Order.incumbent_id= this.incumbent_id.value!;
  this.selected_Order.name_of_owner= this.name_of_owner.value!;
  }
  


  clear(){
    this.Form.reset();
  }

  

  focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  attachments(){

  }

  accountCard(){

  }

  




  sanadDateChange(changeSource: string){
    if (changeSource == 'day')
      this.sanadDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.sanadDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.sanadDateYearIsFilled= true;

    if (this.sanadDateDayIsFilled && this.sanadDateMonthIsFilled && this.sanadDateYearIsFilled){
      this.document_date.setValue(moment(this.sanadDateMonth+'/'+this.sanadDateDay+'/'+this.sanadDateYear).set({hour: 2}).toDate());
    }
    }

  incumbentDateChange(changeSource: string){
    if (changeSource == 'day')
      this.incumbentDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.incumbentDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.incumbentDateYearIsFilled= true;

    if (this.incumbentDateDayIsFilled && this.incumbentDateMonthIsFilled && this.incumbentDateYearIsFilled){
      this.incumbent_date.setValue(moment(this.incumbentDateMonth+'/'+this.incumbentDateDay+'/'+this.incumbentDateYear).set({hour: 2}).toDate());
    }
    }

  onAttachmentDelete(index: number){
    this.selected_Order= this.exchange_order;
    this.getValue();
    this.selected_Order.exchange_order_attachements?.splice(index, 1);
  }

  onDetailsDelete(index: number){
    this.selected_Order= this.exchange_order;
    this.getValue();
    this.selected_Order.exchange_order_details?.splice(index, 1);
  }

  addAttachment(){
    this.exchange_order.exchange_order_attachements?.push({exchange_order_fk: this.exchange_order.exchange_order_seq});
    // console.log('this.sanad_kid', this.sanad_kid);
    // console.log('this.sanad_kid.sanad_kid_details', this.sanad_kid.sanad_kid_details);
  }

  addDetails(){
    this.exchange_order.exchange_order_details?.push({exchange_order_fk: this.exchange_order.exchange_order_seq});
    // console.log('this.sanad_kid', this.sanad_kid);
    // console.log('this.sanad_kid.sanad_kid_details', this.sanad_kid.sanad_kid_details);
  }

  save(){
    this.selected_Order= this.exchange_order;
    this.getValue();
    if( this.selected_Order.exchange_order_seq!= null && this.selected_Order.exchange_order_seq > 0){
      this.exchangeOrderService.update(this.selected_Order).subscribe(res=>{
        if (res != null && (res as result)!= null &&  (res as result).success){
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
    else{
      console.log('this.selected_Order', this.selected_Order);
      this.exchangeOrderService.add(this.selected_Order).subscribe(res=>{
        console.log('res', res);
        if (res != null && (res as result)!= null &&  (res as result).success){
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
}
