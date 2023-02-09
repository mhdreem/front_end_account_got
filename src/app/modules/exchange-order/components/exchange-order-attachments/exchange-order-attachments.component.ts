import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { AttachmentType } from 'src/app/modules/shared/models/attachment-type';
import { ExchangeOrderAttachements } from 'src/app/modules/shared/models/exchange-order-attachements';
import { account_typeService } from 'src/app/modules/shared/services/account-type.service';
import { AttachmentTypeService } from 'src/app/modules/shared/services/attachment-type.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { PageExchangeOrderService } from '../../pageservice/page-exchange-order.service';

@Component({
  selector: 'app-exchange-order-attachments',
  templateUrl: './exchange-order-attachments.component.html',
  styleUrls: ['./exchange-order-attachments.component.css']
})
export class ExchangeOrderAttachmentsComponent {
  _index :number ;
  @Output() onDelete: EventEmitter<number> = new EventEmitter();

  @Input() set index(i :number)
  {
    this._index = i;      
  }

  get exchange_order_attachments():ExchangeOrderAttachements 
  {
    if (
      this.PageExchangeOrderService.exchange_order!= null &&
      this.PageExchangeOrderService.exchange_order.exchange_order_attachements != null &&    
      this._index>=0 && 
      this._index<this.PageExchangeOrderService.exchange_order.exchange_order_attachements?.length)
      { 
        // console.log('this.PageSanadKidService.sanad_kid', this.PageExchangeOrderService.sanad_kid);
        // console.log('this.index', this.index);
        return this.PageExchangeOrderService.exchange_order.exchange_order_attachements[this._index];
      }
      return {};
  }

  set  exchange_order_attachments(obj:ExchangeOrderAttachements) 
  {
    if (
      this.PageExchangeOrderService.exchange_order!= null &&
      this.PageExchangeOrderService.exchange_order.exchange_order_attachements != null &&    
      this._index>=0 && 
      this._index<=this.PageExchangeOrderService.exchange_order.exchange_order_attachements?.length)
      { 
         this.PageExchangeOrderService.exchange_order.exchange_order_attachements[this.index] = obj;
      }
    
  }

  _Subscription!: Subscription;
 
  Form!: FormGroup;
  exchange_order_attachement_seq!: FormControl<number | null>;
  exchange_order_fk!: FormControl<number | null>;
  exchange_order_attachement_id!: FormControl<number | null>;
  exchange_order_attachement_date!: FormControl<Date | null>;
  attachement_type!: FormControl<number | null>;
  exchange_order_attachement_note!: FormControl<string | null>;

  attachment_type_list:AttachmentType[];
  attachment_type_filter:Observable< AttachmentType[]>;

  LoadingFinish : boolean;

  attachmentDateDay: string= '';
  attachmentDateMonth: string= '';
  attachmentDateYear: string= '';

  attachmentDateDayIsFilled: boolean= false;
  attachmentDateMonthIsFilled: boolean= false;
  attachmentDateYearIsFilled: boolean= false;

  constructor(
    private fb: FormBuilder,
    private PageExchangeOrderService:PageExchangeOrderService,
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
        this.bindModelToForm(this.exchange_order_attachments,this.Form);          

      }
      
    }

    public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'exchange_order_attachement_seq': this.exchange_order_attachement_seq = new FormControl<number | null>(null, []),
            'exchange_order_fk': this.exchange_order_fk = new FormControl<number | null>(null, []),          
            'exchange_order_attachement_id': this.exchange_order_attachement_id = new FormControl<number | null>(null, []),          
            'exchange_order_attachement_date': this.exchange_order_attachement_date = new FormControl<Date | null>(null, []),          
            'attachement_type': this.attachement_type = new FormControl<number | null>(null, []),          
            'exchange_order_attachement_note': this.exchange_order_attachement_note = new FormControl<string | null>(null, []),          
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
  
           this.LoadingFinish = true;

          }
          )
        }
      
        Load_attachment_type():Observable<AttachmentType[]>{
          if (this.attachmentTypeService.List_attachment_type == null ||
            this.attachmentTypeService.List_attachment_type == undefined ||
            this.attachmentTypeService.List_attachment_type.length == 0)
            return this.attachmentTypeService.list();
          return of(this.attachmentTypeService.List_attachment_type);
        }
      
        public async Init_AutoComplete() {
          try {
            this.attachment_type_filter = this.attachement_type.valueChanges
              .pipe(
                startWith(''),
                map((value) => value && typeof value === 'string' ? this._filter_attachement_type(value) : this.attachment_type_list.slice())
              );
      
          } catch (Exception: any) { }
        }


        private _filter_attachement_type(value: string): AttachmentType[] {
          const filterValue = value.toLowerCase();      
          return this.attachment_type_list.filter(option => option.attachement_type_name!= null  &&  option.attachement_type_name.includes(filterValue));
        }

        public display_Attachement_Type_Property(value: AttachmentType): string {
          if (value && value.attachement_type_seq) {            
              return value.attachement_type_name!;
          }
          return '';
        }

    public SetValue() {
      try {
  
  
        if (this.exchange_order_attachments != null && this.exchange_order_attachments?.exchange_order_attachement_seq != null)
          this.exchange_order_attachement_seq.setValue(this.exchange_order_attachments.exchange_order_attachement_seq);
       
        if (this.exchange_order_attachments != null && this.exchange_order_attachments.exchange_order_fk != null)
          this.exchange_order_fk.setValue(this.exchange_order_attachments.exchange_order_fk);
          
        if (this.exchange_order_attachments != null && this.exchange_order_attachments.exchange_order_attachement_id != null)
          this.exchange_order_attachement_id.setValue(this.exchange_order_attachments.exchange_order_attachement_id);
          
        if (this.exchange_order_attachments != null && this.exchange_order_attachments.exchange_order_attachement_date != null)
          this.exchange_order_attachement_date.setValue(this.exchange_order_attachments.exchange_order_attachement_date);
          
        if (this.exchange_order_attachments != null && this.exchange_order_attachments.attachement_type != null)
          this.attachement_type.setValue(this.exchange_order_attachments.attachement_type.attachement_type_seq!);
          
        if (this.exchange_order_attachments != null && this.exchange_order_attachments.exchange_order_attachement_note != null)
          this.exchange_order_attachement_note.setValue(this.exchange_order_attachments.exchange_order_attachement_note);
          
        
        
      } catch (ex: any) {
  
  
      }
  
    }
  
    getValue(){
      if ( this.exchange_order_attachments!= null && this.exchange_order_attachement_seq.value!= null )
        this.exchange_order_attachments.exchange_order_attachement_seq= this.exchange_order_attachement_seq.value;
  
      
        if ( this.exchange_order_attachments!= null && this.exchange_order_fk.value!= null )
        this.exchange_order_attachments.exchange_order_fk= this.exchange_order_fk.value;
  
        if ( this.exchange_order_attachments!= null && this.exchange_order_attachement_id.value!= null )
        this.exchange_order_attachments.exchange_order_attachement_id= this.exchange_order_attachement_id.value;
  
        if ( this.exchange_order_attachments!= null && this.exchange_order_attachement_date.value!= null )
        this.exchange_order_attachments.exchange_order_attachement_date= this.exchange_order_attachement_date.value;
  
        if ( this.exchange_order_attachments!= null && this.attachement_type.value!= null )
        this.exchange_order_attachments.attachement_type= this.attachment_type_list.find(type => type.attachement_type_seq== this.attachement_type.value);
  
        if ( this.exchange_order_attachments!= null && this.exchange_order_attachement_note.value!= null )
        this.exchange_order_attachments.exchange_order_attachement_note= this.exchange_order_attachement_note.value;
  
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
      this.exchange_order_attachement_date.setValue(moment(this.attachmentDateMonth+'/'+this.attachmentDateDay+'/'+this.attachmentDateYear).set({hour: 2}).toDate());
    }
   }
}
