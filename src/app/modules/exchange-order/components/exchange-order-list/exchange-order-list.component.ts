import { DOCUMENT } from '@angular/common';
import { Component , HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { ExchangeOrder } from 'src/app/modules/shared/models/exchange-order';
import { ExchangeOrderService } from 'src/app/modules/shared/services/exchange-order.service';

@Component({
  selector: 'app-exchange-order-list',
  templateUrl: './exchange-order-list.component.html',
  styleUrls: ['./exchange-order-list.component.scss']
})
export class ExchangeOrderListComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 123){
      event.preventDefault();
      this.add();
    }
    if(event.keyCode == 119){
      event.preventDefault();
      this.View();
    }
    if(event.keyCode == 118){
      event.preventDefault();
      this.exportToExcel();
    }
    
  }

  // formname:string = 'عرض بيانات الترفيع';
  LoadingFinish : boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<ExchangeOrder>();
  displayedColumns: string[] =
   ['sanad_kid_fk','sanad_kid_date', 'sanad_kid_type_fk', 'total_value', 'incumbent_id', 'incumbent_date', 'name_of_owner', 'branch_name', 'action' ];

  fromSanadDateDay: string= '';
  fromSanadDateMonth: string= '';
  fromSanadDateYear: string= '';
  toSanadDateDay: string= '';
  toSanadDateMonth: string= '';
  toSanadDateYear: string= '';

  fromSanadDateDayIsFilled: boolean= false;
  fromSanadDateMonthIsFilled: boolean= false;
  fromSanadDateYearIsFilled: boolean= false;
  toSanadDateDayIsFilled: boolean= false;
  toSanadDateMonthIsFilled: boolean= false;
  toSanadDateYearIsFilled: boolean= false;

  fromIncumbentDateDay: string= '';
  fromIncumbentDateMonth: string= '';
  fromIncumbentDateYear: string= '';
  toIncumbentDateDay: string= '';
  toIncumbentDateMonth: string= '';
  toIncumbentDateYear: string= '';

  fromIncumbentDateDayIsFilled: boolean= false;
  fromIncumbentDateMonthIsFilled: boolean= false;
  fromIncumbentDateYearIsFilled: boolean= false;
  toIncumbentDateDayIsFilled: boolean= false;
  toIncumbentDateMonthIsFilled: boolean= false;
  toIncumbentDateYearIsFilled: boolean= false;

  Form!: FormGroup;
  sanad_kid_from!: FormControl<number | null>;
  sanad_kid_to!: FormControl<number | null>;
  sanad_kid_date_from!: FormControl<Date | null>;
  sanad_kid_date_to!: FormControl<Date | null>;
  sanad_kid_fk!: FormControl<number | null>;
  incumbent_id_from!: FormControl<number | null>;
  incumbent_id_to!: FormControl<number | null>;
  incumbent_date_from!: FormControl<Date | null>;
  incumbent_date_to!: FormControl<Date | null>;
  sanad_kid_type_fk!: FormControl<number | null>;
  book_fk!: FormControl<number | null>;
  name_of_owner!: FormControl<string | null>;

  

  
  

 

  // Filtering
  // accountType_List: AccountType[] = [];
  // filteredAccountTypeOptions!: Observable<AccountType[]>;
 
 

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  selected_order: ExchangeOrder= {};



  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private exchangeOrderService: ExchangeOrderService
    ) {
    this.LoadingFinish = true;

      this.BuildForm();

     }

     public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'sanad_kid_from': this.sanad_kid_from = new FormControl<number | null>(null, []),
            'sanad_kid_to': this.sanad_kid_to = new FormControl<number | null>(null, []),
            'sanad_kid_date_from': this.sanad_kid_date_from = new FormControl<Date | null>(null, []),
            'sanad_kid_date_to': this.sanad_kid_date_to = new FormControl<Date | null>(null, []),
            'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, []),
            'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null, []),
            'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null, []),
            'incumbent_date_from': this.incumbent_date_from = new FormControl<Date | null>(null, []),
            'incumbent_date_to': this.incumbent_date_to = new FormControl<Date | null>(null, []),
            'sanad_kid_type_fk': this.sanad_kid_type_fk = new FormControl<number | null>(null, []),
            'book_fk': this.book_fk = new FormControl<number | null>(null, []),
            'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
          }
        );
        
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }
  
  
    
  
    
   

  ngOnInit(): void {
    // this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
    //   this.darkTheme= res;
    // })

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  rowClicked!: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  View(){
    this.exchangeOrderService.search(this.Form.value).subscribe(
      (res: any) =>{
        this.dataSource.paginator= this.paginator;
        this.dataSource.data = res;
      }
    );

    // let printRequest= {
    //   "year_id": this.UpgradeYear.value,
    //   "class_id": this.Class.value,
    //   "jobname_id": this.JobName.value,
    //   "accounter_id": this.Accounter.value,
    //   "qualitygrade": this.Rank.value,
    //   "id_start": this.idStart.value,
    //   "id_end": this.idEnd.value,
    //   "type_display_Option": this.TypeDisplay.value,
    // };
    // this.tblShamelUpgradeService.list(printRequest).subscribe(
    //   (res: any) =>{
    //     console.log('printRequest', printRequest);
    //     this.rankInput= res.Item1;
    //     console.log('this.rankInput', this.rankInput);
    //   }
    // );
  }


  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }
  
  clearDataSource(){
    this.dataSource.data= [];
  }

  exportToExcel(){

  }

  Delete(order: ExchangeOrder){
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

  Update(order: ExchangeOrder){
    this.router.navigate(['/exchangeOrder/module/exchangeOrderEdit', { id: order.exchange_order_seq }])

  }

  add(){
    this.router.navigate(['/exchangeOrder/module/exchangeOrderEdit', { id: 0 }]);
  }



  detail(){

  }

  nextDocs(){

  }


  fromSanadDateChange(changeSource: string){
    if (changeSource == 'day')
      this.fromSanadDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.fromSanadDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.fromSanadDateYearIsFilled= true;

    if (this.fromSanadDateDayIsFilled && this.fromSanadDateMonthIsFilled && this.fromSanadDateYearIsFilled){
      this.sanad_kid_date_from.setValue(moment(this.fromSanadDateMonth+'/'+this.fromSanadDateDay+'/'+this.fromSanadDateYear).set({hour: 2}).toDate());
    }
   }

   toSanadDateChange(changeSource: string){
    if (changeSource == 'day')
      this.toSanadDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.toSanadDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.toSanadDateYearIsFilled= true;

    if (this.toSanadDateDayIsFilled && this.toSanadDateMonthIsFilled && this.toSanadDateYearIsFilled){
      this.sanad_kid_date_to.setValue(moment(this.toSanadDateMonth+'/'+this.toSanadDateDay+'/'+this.toSanadDateYear).set({hour: 2}).toDate());
    }
   }

  fromIncumbentDateChange(changeSource: string){
    if (changeSource == 'day')
      this.fromIncumbentDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.fromIncumbentDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.fromIncumbentDateYearIsFilled= true;

    if (this.fromIncumbentDateDayIsFilled && this.fromIncumbentDateMonthIsFilled && this.fromIncumbentDateYearIsFilled){
      this.incumbent_date_from.setValue(moment(this.fromIncumbentDateMonth+'/'+this.fromIncumbentDateDay+'/'+this.fromIncumbentDateYear).set({hour: 2}).toDate());
    }
   }

   toIncumbentDateChange(changeSource: string){
    if (changeSource == 'day')
      this.toIncumbentDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.toIncumbentDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.toIncumbentDateYearIsFilled= true;

    if (this.toIncumbentDateDayIsFilled && this.toIncumbentDateMonthIsFilled && this.toIncumbentDateYearIsFilled){
      this.incumbent_date_to.setValue(moment(this.toIncumbentDateMonth+'/'+this.toIncumbentDateDay+'/'+this.toIncumbentDateYear).set({hour: 2}).toDate());
    }
   }

   onSanadTypeSelect(source:number){
    this.sanad_kid_type_fk.setValue(source);
   }
}
