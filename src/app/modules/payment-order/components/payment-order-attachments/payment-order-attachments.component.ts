import { DOCUMENT } from '@angular/common';
import { Component, HostListener, EventEmitter, Inject, Input, OnDestroy, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { attachement_type } from 'src/app/modules/shared/models/attachement_type';
import { payment_order_attachement } from 'src/app/modules/shared/models/payment_order_attachement';
import { AttachmentTypeService } from 'src/app/modules/shared/services/attachment-type.service';
import { PagePaymentOrderService } from '../../pageservice/page-payment-order.service';

@Component({
  selector: 'app-payment-order-attachments',
  templateUrl: './payment-order-attachments.component.html',
  styleUrls: ['./payment-order-attachments.component.scss']
})
export class PaymentOrderAttachmentsComponent implements OnDestroy,OnChanges{
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // enter
    if(event.keyCode == 13){
      event.preventDefault();
    }
  }
  _index: number;
  @Output() onDelete: EventEmitter<number> = new EventEmitter();

  @Input() set index(i: number) {
    this._index = i;
  }
  get index(): number {
    return this._index;
  }

  _payment_order_attachement: payment_order_attachement;

  get payment_order_attachement(): payment_order_attachement {
    return this._payment_order_attachement;
  }

  @Input() set payment_order_attachement(obj: payment_order_attachement) {
    this._payment_order_attachement = obj;
  }

  _Subscription!: Subscription;



  Form!: FormGroup;
  payment_order_attachement_seq!: FormControl<number | null>;
  payment_order_fk!: FormControl<number | null>;
  payment_order_attachement_id!: FormControl<number | null>;
  payment_order_attachement_date!: FormControl<Date | null>;
  type_fk!: FormControl<number | null>;
  // attachement_type!: FormControl<attachement_type | null>;
  payment_order_attachement_note!: FormControl<string | null>;




  attachment_type_list: attachement_type[];
  attachment_type_filter: Observable<attachement_type[]>;

  LoadingFinish: boolean;

  attachmentDateDay: string = '';
  attachmentDateMonth: string = '';
  attachmentDateYear: string = '';

  attachmentDateDayIsFilled: boolean = false;
  attachmentDateMonthIsFilled: boolean = false;
  attachmentDateYearIsFilled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private PagePaymentOrderService: PagePaymentOrderService,
    @Inject(DOCUMENT) private _document: Document,
    private attachmentTypeService: AttachmentTypeService
  ) {
    this.LoadingFinish = true;
    this.BuildForm();
    this.Load_Data();
  }
  ngOnDestroy(): void {
   if (this._Subscription!= null)
    this._Subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['index'] != null) {
      this.index = changes['index'].currentValue;
    }
    if (changes != null && changes['index'] != null) {
      // load data must executed before set value
      this.Load_Data();
      //this.SetValue();
      this.bindModelToForm(this.payment_order_attachement, this.Form);

    }
  }

  bindModelToForm(model: any, form: FormGroup) {
    if (model == null || form == null)
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

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'payment_order_attachement_seq': this.payment_order_attachement_seq = new FormControl<number | null>(null, []),
          'payment_order_fk': this.payment_order_fk = new FormControl<number | null>(null, []),
          'payment_order_attachement_id': this.payment_order_attachement_id = new FormControl<number | null>(null, []),
          'payment_order_attachement_date': this.payment_order_attachement_date = new FormControl<Date | null>(null, []),
          'type_fk': this.type_fk = new FormControl<number | null>(null, []),
          // 'attachement_type': this.attachement_type = new FormControl<attachement_type | null>(null, []),
          'payment_order_attachement_note': this.payment_order_attachement_note = new FormControl<string | null>(null, []),
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
        this.SetValue();
        this.LoadingFinish = true;

      }
    )
  }

  Load_attachment_type(): Observable<attachement_type[]> {
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
    return this.attachment_type_list.filter(option => option.attachement_type_name != null && option.attachement_type_name.includes(filterValue));
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


      if (this.payment_order_attachement != null && this.payment_order_attachement?.payment_order_attachement_seq != null)
        this.payment_order_attachement_seq.setValue(this.payment_order_attachement.payment_order_attachement_seq);


      if (this.payment_order_attachement != null && this.payment_order_attachement.payment_order_fk != null)
        this.payment_order_fk.setValue(this.payment_order_attachement.payment_order_fk);


      if (this.payment_order_attachement != null && this.payment_order_attachement.payment_order_attachement_id != null)
        this.payment_order_attachement_id.setValue(this.payment_order_attachement.payment_order_attachement_id);


      if (this.payment_order_attachement != null && this.payment_order_attachement.payment_order_attachement_date != null){
        this.payment_order_attachement_date.setValue(this.payment_order_attachement.payment_order_attachement_date);
        this.attachmentDateDay = moment(this.payment_order_attachement_date.value).date() + '';
        this.attachmentDateMonth = (moment(this.payment_order_attachement_date.value).month() + 1) + '';
        this.attachmentDateYear = moment(this.payment_order_attachement_date.value).year() + '';
        this.attachmentDateDayIsFilled = true;
        this.attachmentDateMonthIsFilled= true;
        this.attachmentDateYearIsFilled = true;
      }


      if (this.payment_order_attachement != null && this.payment_order_attachement.type_fk != null)
        this.type_fk.setValue(this.payment_order_attachement.type_fk);


      // if (this.payment_order_attachement != null && this.payment_order_attachement.attachement_type != null)
      //   this.attachement_type.setValue(this.payment_order_attachement.attachement_type);



      if (this.payment_order_attachement != null && this.payment_order_attachement.payment_order_attachement_note != null)
        this.payment_order_attachement_note.setValue(this.payment_order_attachement.payment_order_attachement_note);



    } catch (ex: any) {


    }

  }


  getValue() {
    if (this.payment_order_attachement != null && this.payment_order_attachement_seq.value != null)
      this.payment_order_attachement.payment_order_attachement_seq = this.payment_order_attachement_seq.value;


    if (this.payment_order_attachement != null && this.payment_order_fk.value != null)
      this.payment_order_attachement.payment_order_fk = this.payment_order_fk.value;

    if (this.payment_order_attachement != null && this.payment_order_attachement_id.value != null)
      this.payment_order_attachement.payment_order_attachement_id = this.payment_order_attachement_id.value;

    if (this.payment_order_attachement != null && this.payment_order_attachement_date.value != null)
      this.payment_order_attachement.payment_order_attachement_date = this.payment_order_attachement_date.value;

      if (this.payment_order_attachement != null && this.type_fk.value != null)
      this.payment_order_attachement.type_fk = this.type_fk.value;

    // if (this.payment_order_attachement != null && this.type_fk.value != null)
    //   this.payment_order_attachement.attachement_type = this.attachment_type_list.find(type => type.attachement_type_seq == this.type_fk.value);

    if (this.payment_order_attachement != null && this.payment_order_attachement_note.value != null)
      this.payment_order_attachement.payment_order_attachement_note = this.payment_order_attachement_note.value;
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

  delete() {
    this.onDelete.emit(this._index)
  }


  attachmentDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.attachmentDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.attachmentDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.attachmentDateYearIsFilled = true;

    if (this.attachmentDateDayIsFilled && this.attachmentDateMonthIsFilled && this.attachmentDateYearIsFilled) {
      this.payment_order_attachement_date.setValue(moment(this.attachmentDateMonth + '/' + this.attachmentDateDay + '/' + this.attachmentDateYear).set({ hour: 4 }).toDate());
    }
  }


  // Select_Attatchement_Type_Option(event: any) {

  //   const selectedValue = event.option.value;

  //   if (selectedValue != null) {
  //     this.type_fk.setValue(selectedValue);

  //     var attachement_types = this.attachment_type_list.filter(x => x.attachement_type_seq == selectedValue);
  //     if (attachement_types != null && attachement_types.length > 0) {
  //       this.attachement_type.setValue(attachement_types[0]);
  //     }

  //   }

  // }
}
