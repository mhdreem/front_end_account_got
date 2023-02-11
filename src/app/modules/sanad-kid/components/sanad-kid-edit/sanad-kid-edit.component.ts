import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { result } from 'src/app/modules/shared/models/result';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';
import { PageSanadKidService } from '../../pageservice/page-sanad-kid.service';

@Component({
  selector: 'app-sanad-kid-edit',
  templateUrl: './sanad-kid-edit.component.html',
  styleUrls: ['./sanad-kid-edit.component.scss']
})
export class SanadKidEditComponent implements OnInit {

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

  get sanad_kid():sanad_kid 
  {
    if (
      this.PageSanadKidService.sanad_kid!= null  )
      { 
        return this.PageSanadKidService.sanad_kid;
      }
      return {};
  }

  set sanad_kid(obj:sanad_kid) 
  {
    this.PageSanadKidService.sanad_kid= obj;
  }

  _Subscription!: Subscription;
 
  Form!: FormGroup;
  sanad_kid_seq!: FormControl<number | null>;
  document_id!: FormControl<number | null>;
  document_date!: FormControl<Date | null>;
  operation_type_fk!: FormControl<number | null>;
  operation_code_fk!: FormControl<number | null>;
  incumbent_id!: FormControl<number | null>;
  incumbent_date!: FormControl<Date | null>;
  sanad_kid_type_fk!: FormControl<number | null>;
  Book_fk!: FormControl<number | null>;
  sanad_total_value: FormControl<number | null>;
  sanad_close: FormControl<boolean | null>;
  name_of_owner: FormControl<string | null>;
  
 
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

  selected_Sanad: sanad_kid= {};

  LoadingFinish : boolean;

  constructor(
    private router:Router,private route: ActivatedRoute,
    private fb: FormBuilder,
    private SanadKidBookService:SanadKidBookService,
    private PageSanadKidService:PageSanadKidService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private sanadKidService: SanadKidService) { 
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
            'sanad_kid_seq': this.sanad_kid_seq = new FormControl<number | null>(null, [Validators.required]),
            'document_id': this.document_id = new FormControl<number | null>(null, [Validators.required]),
            'document_date': this.document_date = new FormControl<Date | null>(null, [Validators.required]),
            'operation_type_fk': this.operation_type_fk = new FormControl<number | null>(null, []),
            'operation_code_fk': this.operation_code_fk = new FormControl<number | null>(null, []),
            'incumbent_date': this.incumbent_date = new FormControl<Date | null>(null, []),
            'incumbent_id': this.incumbent_id = new FormControl<number | null>(null, []),
            'sanad_close': this.sanad_close = new FormControl<boolean | null>(null, []),
            'sanad_total_value': this.sanad_total_value = new FormControl<number | null>(null, []),
            'Book_fk': this.Book_fk = new FormControl<number | null>(null, [Validators.required]),
            'sanad_kid_type_fk': this.sanad_kid_type_fk = new FormControl<number | null>(null, []),
            'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
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
        this.sanadKidService.getBySeq(seq).subscribe(res =>{
          this.selected_Sanad = res;
          this.sanad_kid= this.selected_Sanad;
          this.SetValue();
        })
      }
      else{
        this.sanad_kid= {};
        this.sanad_kid.sanad_kid_details= [];
      }
  
    }

  public SetValue() {
    if (this.selected_Sanad != null && this.selected_Sanad.document_date != null){
      this.document_date.setValue(this.selected_Sanad.document_date);
      this.sanadDateDay= moment(this.document_date.value).date()+'';
      this.sanadDateMonth= moment(this.document_date.value).month()+'';
      this.sanadDateYear= moment(this.document_date.value).year()+'';
    }

    if (this.selected_Sanad != null && this.selected_Sanad.incumbent_date != null)
      this.incumbent_date.setValue(this.selected_Sanad?.incumbent_date!);
      this.incumbentDateDay= moment(this.incumbent_date.value).date()+'';
      this.incumbentDateMonth= moment(this.incumbent_date.value).month()+'';
      this.incumbentDateYear= moment(this.incumbent_date.value).year()+'';


    if (this.selected_Sanad != null && this.selected_Sanad.document_id != null)
      this.document_id.setValue(this.selected_Sanad?.document_id!);

      
    if (this.selected_Sanad != null && this.selected_Sanad.incumbent_id != null)
      this.incumbent_id.setValue(this.selected_Sanad?.incumbent_id!);

    if (this.selected_Sanad != null && this.selected_Sanad.sanad_close != null)
      this.sanad_close.setValue((this.selected_Sanad?.sanad_close==1? true:false)!);

    if (this.selected_Sanad != null && this.selected_Sanad.name_of_owner != null)
      this.name_of_owner.setValue(this.selected_Sanad?.name_of_owner!);

    }
  
  getValue(){
  this.selected_Sanad.document_date= moment(this.sanadDateMonth+'/'+this.sanadDateDay+'/'+this.sanadDateYear).set({hour: 2}).toDate();
  this.selected_Sanad.incumbent_date= moment(this.incumbentDateMonth+'/'+this.incumbentDateDay+'/'+this.incumbentDateYear).set({hour: 2}).toDate();
  this.selected_Sanad.document_id= this.document_id.value!;
  this.selected_Sanad.incumbent_id= this.incumbent_id.value!;
  this.selected_Sanad.sanad_close= (this.sanad_close.value==true? 1:0)!;
  this.selected_Sanad.name_of_owner= this.name_of_owner.value!;
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

  onDelete(index: number){
    this.selected_Sanad= this.sanad_kid;
    this.getValue();
    this.selected_Sanad.sanad_kid_details?.splice(index, 1);
  }

  addDetails(){
    this.sanad_kid.sanad_kid_details?.push({sanad_Kid_fk: this.sanad_kid.sanad_kid_seq});
    console.log('this.sanad_kid', this.sanad_kid);
    console.log('this.sanad_kid.sanad_kid_details', this.sanad_kid.sanad_kid_details);
  }

  save(){
    this.selected_Sanad= this.sanad_kid;
    this.getValue();
    if( this.selected_Sanad.sanad_kid_seq!= null && this.selected_Sanad.sanad_kid_seq > 0){
      this.sanadKidService.update(this.selected_Sanad).subscribe(res=>{
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
      console.log('this.selected_Sanad', this.selected_Sanad);
      this.sanadKidService.add(this.selected_Sanad).subscribe(res=>{
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
