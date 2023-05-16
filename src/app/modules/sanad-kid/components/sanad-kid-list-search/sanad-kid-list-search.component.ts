import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';

@Component({
  selector: 'app-sanad-kid-list-search',
  templateUrl: './sanad-kid-list-search.component.html',
  styleUrls: ['./sanad-kid-list-search.component.scss']
})
export class SanadKidListSearchComponent {

  List_Type_Sanad :any []=[
    {value:1,name:'كامل'},
    {value:2,name:'مسودة'},
  ]

  @Input() Title:string = '';
  @Output() OnSeachCommandExecute : EventEmitter<any> = new EventEmitter<any>();


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {

   
    if(event.keyCode == 119){
      event.preventDefault();
      this.View();
    }
  
    
  }

  
  LoadingFinish : boolean;

  fromDateDay: string= '';
  fromDateMonth: string= '';
  fromDateYear: string= '';
  toDateDay: string= '';
  toDateMonth: string= '';
  toDateYear: string= '';


  incumbentDateFromDay: string= '';
  incumbentDateFromMonth: string= '';
  incumbentDateFromYear: string= '';
  incumbentDateToDay: string= '';
  incumbentDateToMonth: string= '';
  incumbentDateToYear: string= '';
  

  fromDateDayIsFilled: boolean= false;
  fromDateMonthIsFilled: boolean= false;
  fromDateYearIsFilled: boolean= false;
  toDateDayIsFilled: boolean= false;
  toDateMonthIsFilled: boolean= false;
  toDateYearIsFilled: boolean= false;

  Form!: FormGroup;
  document_date_from!: FormControl<Date | null>;
  document_date_to!: FormControl<Date | null>;
  incumbent_date_from!: FormControl<Date | null>;
  incumbent_date_to!: FormControl<Date | null>;


  sanad_kid_seq!: FormControl<number | null>;
  incumbent_id_from!: FormControl<number | null>;
  incumbent_id_to!: FormControl<number | null>;
  sanad_kid_id_from!: FormControl<number | null>;
  sanad_kid_id_to!: FormControl<number | null>;
  sanad_close!: FormControl<number | null>;
  sanad_close_boolean!: FormControl<number | null>;
  name_of_owner!: FormControl<string | null>;
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;
  sanad_kid_type_fk!: FormControl<number | null>;
  

  
  

 
 

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;
  selected_sanad: sanad_kid= {};



  constructor(
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private sanadKidService: SanadKidService    ) {
    this.LoadingFinish = true;

      this.BuildForm();

     }

     public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'document_date_from': this.document_date_from = new FormControl<Date | null>(null, []),
            'document_date_to': this.document_date_to = new FormControl<Date | null>(null, []),

            'incumbent_date_from': this.incumbent_date_from = new FormControl<Date | null>(null, []),
            'incumbent_date_to': this.incumbent_date_to = new FormControl<Date | null>(null, []),

            'sanad_kid_type_fk': this.sanad_kid_type_fk = new FormControl<number | null>(null, []),

            'sanad_kid_seq': this.sanad_kid_seq = new FormControl<number | null>(null, []),
            'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null, []),
            'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null, []),
            'sanad_kid_id_from': this.sanad_kid_id_from = new FormControl<number | null>(null, []),
            'sanad_kid_id_to': this.sanad_kid_id_to = new FormControl<number | null>(null, []),
            'sanad_close': this.sanad_close = new FormControl<number | null>(null, []),
            'sanad_close_boolean': this.sanad_close_boolean = new FormControl<number | null>(null, []),            
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
    
  }

  rowClicked!: number;

  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  public onViewClick() {
    this.currentPage = 0;
    this.pageSize = 5;
    this.page_index.setValue(this.currentPage);
    this.row_count.setValue(this.pageSize);
    this.OnSeachCommandExecute.emit(this.Form.value);
  }
  

  View(){
    this.isLoading= true;
    this.page_index.setValue(this.currentPage);
    this.row_count.setValue(this.pageSize);
    return this.sanadKidService.search(this.Form.value);
  }


  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }
  







  fromDateChange(changeSource: string){
    if (changeSource == 'day')
      this.fromDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.fromDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.fromDateYearIsFilled= true;

    if (this.fromDateDayIsFilled && this.fromDateMonthIsFilled && this.fromDateYearIsFilled){
      this.document_date_from.setValue(moment(this.fromDateMonth+'/'+this.fromDateDay+'/'+this.fromDateYear).set({hour: 2}).toDate());
    }
   }

   toDateChange(changeSource: string){
    if (changeSource == 'day')
      this.toDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.toDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.toDateYearIsFilled= true;

    if (this.toDateDayIsFilled && this.toDateMonthIsFilled && this.toDateYearIsFilled){
      this.document_date_to.setValue(moment(this.toDateMonth+'/'+this.toDateDay+'/'+this.toDateYear).set({hour: 2}).toDate());
    }
   }


   IncumbentFromDateChange(changeSource: string){
    if (changeSource == 'day')
      this.fromDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.fromDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.fromDateYearIsFilled= true;

    if (this.fromDateDayIsFilled && this.fromDateMonthIsFilled && this.fromDateYearIsFilled){
      this.incumbent_date_from.setValue(moment(this.fromDateMonth+'/'+this.fromDateDay+'/'+this.fromDateYear).set({hour: 2}).toDate());
    }
   }

   IncumbentToDateChange(changeSource: string){
    if (changeSource == 'day')
      this.toDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.toDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.toDateYearIsFilled= true;

    if (this.toDateDayIsFilled && this.toDateMonthIsFilled && this.toDateYearIsFilled){
      this.incumbent_date_to.setValue(moment(this.toDateMonth+'/'+this.toDateDay+'/'+this.toDateYear).set({hour: 2}).toDate());
    }
   }


   
  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, { windowClass: 'sidepanel sidepanel-fade', size: 'side-70', backdropClass: 'light-blue-backdrop' }).result.then((Result) => {

      if (Result == 1) {
        this.currentPage = 0;
        this.pageSize = 5;
        this.page_index.setValue(this.currentPage);
        this.row_count.setValue(this.pageSize);
        this.OnSeachCommandExecute.emit(this.Form.value);
      }
      else
        this.OnSeachCommandExecute.emit({});


    }).catch(() => {

    });
  }

  OnChangeSanadClose($event:any)
  {
    this.Form.controls['sanad_close'].setValue(0);
    if ($event!= null && $event.checked!= null && $event.checked== true )
      this.Form.controls['sanad_close'].setValue(1);


  }
}
