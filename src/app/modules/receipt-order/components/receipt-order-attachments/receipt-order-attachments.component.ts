import { DOCUMENT } from '@angular/common';
import { Component, HostListener, EventEmitter, Inject, Input, OnDestroy, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { attachement_type } from 'src/app/modules/shared/models/attachement_type';
import { receipt_order_attachement } from 'src/app/modules/shared/models/receipt_order_attachement';
import { AttachmentTypeService } from 'src/app/modules/shared/services/attachment-type.service';
import { PageReceiptOrderService } from '../../pageservice/page-receipt-order.service';


@Component({
  selector: 'app-receipt-order-attachments',
  templateUrl: './receipt-order-attachments.component.html',
  styleUrls: ['./receipt-order-attachments.component.scss']
})
export class ReceiptOrderAttachmentsComponent implements OnDestroy, OnChanges {

  @Input() formGroup: FormGroup;
  @Input() name: string;
  _FormArray: any[] = []

  @Input() set FormArray( arr : any[]) 
  {
    this._FormArray =[];
    this._FormArray = arr;    
  }

  get FormArray() : any[]
  {
    return this._FormArray;
  }

  @Output() OnNew: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() onDelete: EventEmitter<number> = new EventEmitter();


  _Subscription!: Subscription;




  attachment_type_list: attachement_type[];
  attachment_type_filter: Observable<attachement_type[]>;

  LoadingFinish: boolean;


  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private _document: Document,
    private attachmentTypeService: AttachmentTypeService
  ) {
    this.LoadingFinish = true;

    this.Load_Data();
  }

  ngOnDestroy(): void {
    if (this._Subscription != null)
      this._Subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formGroup'] != null) {
      this.formGroup = changes['formGroup'].currentValue;
    }
    if (changes != null && changes['FormArray'] != null) {
      this.FormArray =[];
      this.FormArray = changes['FormArray'].currentValue;
    }
    if (changes != null && changes['name'] != null) {
      this.name = changes['name'].currentValue;
    }
  }


  ngOnInit() {

  }


  getControls(name: string, FormGroup: any) {
    if (FormGroup != null && FormGroup.controls != null && name != null && name.length > 0) {
      return FormGroup.controls[name];
    }
    return null;
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

  Load_attachment_type(): Observable<attachement_type[]> {
    if (this.attachmentTypeService.List_attachment_type == null ||
      this.attachmentTypeService.List_attachment_type == undefined ||
      this.attachmentTypeService.List_attachment_type.length == 0)
      return this.attachmentTypeService.list();
    return of(this.attachmentTypeService.List_attachment_type);
  }




  delete(index: number) {
    this.onDelete.emit(index)
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






}
