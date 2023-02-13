import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { attachement_type } from 'src/app/modules/shared/models/attachement_type';
import { exchange_order_attachement } from 'src/app/modules/shared/models/exchange_order_attachement';
import { sanad_kid_attachement } from 'src/app/modules/shared/models/sanad_kid_attachement';
import { AttachmentTypeService } from 'src/app/modules/shared/services/attachment-type.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { PageSanadKidService } from '../../pageservice/page-sanad-kid.service';

@Component({
  selector: 'app-sanad-kid-attachments',
  templateUrl: './sanad-kid-attachments.component.html',
  styleUrls: ['./sanad-kid-attachments.component.scss']
})
export class SanadKidAttachmentsComponent {
  _index :number ;
  @Output() onDelete: EventEmitter<number> = new EventEmitter();

  @Input() set index(i :number)
  {
    this._index = i;      
  }

  get sanad_kid_attachements():sanad_kid_attachement
  {
    if (
      this.pageSanadKidService.sanad_kid!= null &&
      this.pageSanadKidService.sanad_kid.sanad_kid_attachements != null &&    
      this._index>=0 && 
      this._index<this.pageSanadKidService.sanad_kid.sanad_kid_attachements?.length)
      { 
        // console.log('this.PageSanadKidService.sanad_kid', this.PageExchangeOrderService.sanad_kid);
        // console.log('this.index', this.index);
        return this.pageSanadKidService.sanad_kid.sanad_kid_attachements[this._index];
      }
      return {};
  }
  
  set  sanad_kid_attachements(obj:sanad_kid_attachement) 
  {
    if (
      this.pageSanadKidService.sanad_kid!= null &&
      this.pageSanadKidService.sanad_kid.sanad_kid_attachements != null &&    
      this._index>=0 && 
      this._index<=this.pageSanadKidService.sanad_kid.sanad_kid_attachements?.length)
      { 
         this.pageSanadKidService.sanad_kid.sanad_kid_attachements[this.index] = obj;
      }
    
  }

  _Subscription!: Subscription;
 
  Form!: FormGroup;
  sanad_kid_attachement_seq!: FormControl<number | null>;
  sanad_kid_fk!: FormControl<number | null>;
  sanad_kid_attachement_id!: FormControl<number | null>;
  sanad_kid_attachement_date!: FormControl<Date | null>;
  type_fk!: FormControl<number | null>;
  sanad_kid_attachement_note!: FormControl<string | null>;

  attachment_type_list:attachement_type[];
  attachment_type_filter:Observable< attachement_type[]>;

  LoadingFinish : boolean;

  attachmentDateDay: string= '';
  attachmentDateMonth: string= '';
  attachmentDateYear: string= '';

  attachmentDateDayIsFilled: boolean= false;
  attachmentDateMonthIsFilled: boolean= false;
  attachmentDateYearIsFilled: boolean= false;

  constructor(
    private fb: FormBuilder,
    private pageSanadKidService:PageSanadKidService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,  
    private formValidatorsService: FormValidationHelpersService,
    private attachmentTypeService: AttachmentTypeService
    ) { 
      this.LoadingFinish = true;
      this.BuildForm();    
      this.Load_Data();  
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['index']!= null ) {
          this.index = changes['index'].currentValue;
      }
      if ( changes!= null && changes['index']!=null)    
      {
        this.SetValue();
        this.bindModelToForm(this.sanad_kid_attachements,this.Form);          

      }
      
    }

    public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'sanad_kid_attachement_seq': this.sanad_kid_attachement_seq = new FormControl<number | null>(null, []),
            'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, []),          
            'sanad_kid_attachement_id': this.sanad_kid_attachement_id = new FormControl<number | null>(null, []),          
            'sanad_kid_attachement_date': this.sanad_kid_attachement_date = new FormControl<Date | null>(null, []),          
            'type_fk': this.type_fk = new FormControl<number | null>(null, []),          
            'sanad_kid_attachement_note': this.sanad_kid_attachement_note = new FormControl<string | null>(null, []),          
          },
        );
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }
  
    Load_Data() {
      this.LoadingFinish = false;
      this._Subscription = forkJoin(
        this.Load_attachment_type(),
        ).subscribe(
          res => {
            this.attachment_type_list = res[0];
          this.attachment_type_filter = of(this.attachment_type_list);
          this.attachmentTypeService.List_attachment_type = this.attachment_type_list;
          this.attachmentTypeService.List_attachment_type_BehaviorSubject.next(this.attachmentTypeService.List_attachment_type);
  
          this.Init_AutoComplete();

           this.LoadingFinish = true;

          }
          )
        }
      
        Load_attachment_type():Observable<attachement_type[]>{
          if (this.attachmentTypeService.List_attachment_type == null ||
            this.attachmentTypeService.List_attachment_type == undefined ||
            this.attachmentTypeService.List_attachment_type.length == 0)
            return this.attachmentTypeService.list();
          return of(this.attachmentTypeService.List_attachment_type);
        }
      
        public async Init_AutoComplete() {
          try {
            this.attachment_type_filter = this.type_fk.valueChanges
              .pipe(
                startWith(''),
                map((value) => value && typeof value === 'string' ? this._filter_attachement_type(value) : this.attachment_type_list.slice())
              );
      
          } catch (Exception: any) { }
        }


        private _filter_attachement_type(value: string): attachement_type[] {
          const filterValue = value.toLowerCase(); 
          console.log('value', value);     
          return this.attachment_type_list.filter(option => option.attachement_type_name!= null  &&  option.attachement_type_name.includes(filterValue));
        }

        public display_Attachement_Type_Property(value: attachement_type): string {
          if (value && this.attachment_type_list) {      
            let type: any = this.attachment_type_list.find(type => type.attachement_type_seq!.toString() == value);      
            if (type)
              return type.attachement_type_name!;
              
          }
          return '';
        }

    public SetValue() {
      try {
  
  
        if (this.sanad_kid_attachements != null && this.sanad_kid_attachements?.sanad_kid_attachement_seq != null)
          this.sanad_kid_attachement_seq.setValue(this.sanad_kid_attachements.sanad_kid_attachement_seq);
       
        if (this.sanad_kid_attachements != null && this.sanad_kid_attachements.sanad_kid_fk != null)
          this.sanad_kid_fk.setValue(this.sanad_kid_attachements.sanad_kid_fk);
          
        if (this.sanad_kid_attachements != null && this.sanad_kid_attachements.sanad_kid_attachement_id != null)
          this.sanad_kid_attachement_id.setValue(this.sanad_kid_attachements.sanad_kid_attachement_id);
          
        if (this.sanad_kid_attachements != null && this.sanad_kid_attachements.sanad_kid_attachement_date != null)
          this.sanad_kid_attachement_date.setValue(this.sanad_kid_attachements.sanad_kid_attachement_date);
          
        if (this.sanad_kid_attachements != null && this.sanad_kid_attachements.attachement_type != null)
          this.type_fk.setValue(this.sanad_kid_attachements.attachement_type.attachement_type_seq!);
          
        if (this.sanad_kid_attachements != null && this.sanad_kid_attachements.sanad_kid_attachement_note != null)
          this.sanad_kid_attachement_note.setValue(this.sanad_kid_attachements.sanad_kid_attachement_note);
          
        
        
      } catch (ex: any) {
  
  
      }
  
    }
  
    getValue(){
      if ( this.sanad_kid_attachements!= null && this.sanad_kid_attachement_seq.value!= null )
        this.sanad_kid_attachements.sanad_kid_attachement_seq= this.sanad_kid_attachement_seq.value;
  
      
        if ( this.sanad_kid_attachements!= null && this.sanad_kid_fk.value!= null )
        this.sanad_kid_attachements.sanad_kid_fk= this.sanad_kid_fk.value;
  
        if ( this.sanad_kid_attachements!= null && this.sanad_kid_attachement_id.value!= null )
        this.sanad_kid_attachements.sanad_kid_attachement_id= this.sanad_kid_attachement_id.value;
  
        if ( this.sanad_kid_attachements!= null && this.sanad_kid_attachement_date.value!= null )
        this.sanad_kid_attachements.sanad_kid_attachement_date= this.sanad_kid_attachement_date.value;
  
        if ( this.sanad_kid_attachements!= null && this.type_fk.value!= null )
        this.sanad_kid_attachements.attachement_type= this.attachment_type_list.find(type => type.attachement_type_seq== this.type_fk.value);
  
        if ( this.sanad_kid_attachements!= null && this.sanad_kid_attachement_note.value!= null )
        this.sanad_kid_attachements.sanad_kid_attachement_note= this.sanad_kid_attachement_note.value;
  
    }
  
    Reset(): void {
    
    }
  
    clear(){
      this.Form.reset();
    }
  
    //auto bind 
  
    focusNext(id: string) {
      let element = this._document.getElementById(id);
      if (element) {
        element.focus();
      }
    }
  
    delete(){
      this.onDelete.emit(this._index)
    }
  
    bindModelToForm(model: any, form: FormGroup) {
      if (model== null ||  form == null)
      return;
      const keys = Object.keys(form.controls);
      keys.forEach(key => {
        
          form.controls[key].valueChanges.subscribe(
              (newValue) => {
                model[key] = newValue;
              }
          )
      });
  }

  attachmentDateChange(changeSource: string){
    if (changeSource == 'day')
      this.attachmentDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.attachmentDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.attachmentDateYearIsFilled= true;

    if (this.attachmentDateDayIsFilled && this.attachmentDateMonthIsFilled && this.attachmentDateYearIsFilled){
      this.sanad_kid_attachement_date.setValue(moment(this.attachmentDateMonth+'/'+this.attachmentDateDay+'/'+this.attachmentDateYear).set({hour: 4}).toDate());
    }
   }
}
