import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { payment_order } from 'src/app/modules/shared/models/payment_order';
import { PaymentOrderService } from 'src/app/modules/shared/services/payment-order.service';
import { PagePaymentOrderService } from '../../pageservice/page-payment-order.service';

import { month, months } from 'src/app/modules/shared/models/month';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-payment-order-search-bar',
  templateUrl: './payment-order-search-bar.component.html',
  styleUrls: ['./payment-order-search-bar.component.scss']
})
export class PaymentOrderSearchBarComponent {
  Selected_payment_order: payment_order;


  @Input() Title: string = '';
  @Output() OnSelectItem: EventEmitter<any> = new EventEmitter<any>();


  months: month[] = months;

  incumbent_id_from: FormControl<number | null>;
  incumbent_id_to: FormControl<number | null>;

  document_id_from: FormControl<number | null>;
  document_id_to: FormControl<number | null>;


  payment_order_list: payment_order[] = [];


  sanad_month: FormControl<number[] | null>;
  incumbent_month: FormControl<number[] | null>;
  page_index: FormControl<number | null>;

  from_num_is_inserted: boolean = false;
  to_num_is_inserted: boolean = false;

  Form: FormGroup;

  darkTheme: boolean;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private pageService: PagePaymentOrderService,
    public dialog: MatDialog,
    private paymentOrderService: PaymentOrderService,
    @Inject(DOCUMENT) private _document: Document) {

    console.log(this.months);
    this.Form = this.fb.group({
      'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null),
      'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null),
      'document_id_from': this.document_id_from = new FormControl<number | null>(null),
      'document_id_to': this.document_id_to = new FormControl<number | null>(null),
      'month_incumbent': this.sanad_month = new FormControl<number[] | null>(null),
      'month_document': this.incumbent_month = new FormControl<number[] | null>(null),
      'page_index': this.page_index = new FormControl<number | null>(1),
    });


  }


  ngOnInit(): void {

  }


  PerformSearch() {
    this.payment_order_list = [];
    this.page_index.setValue(1);
    this.RefreshList();
  }

  RefreshList() {
    console.log('this.Form.value', this.Form.value);
    this.paymentOrderService.search(this.Form.value).subscribe((res: any) => {
      console.log('res', res);
      this.payment_order_list = [...this.payment_order_list, ...res.value];
      console.log('this.exchange_order_list', this.payment_order_list);
    });

  }


  SelectItemChange(Selected_payment_order: payment_order) {
    this.Selected_payment_order = Selected_payment_order;
    this.pageService.$payment_order.next(this.Selected_payment_order);
  }






  onScroll() {
    this.page_index.setValue(this.page_index.value! + 1);
    this.Form.controls['page_index'].setValue(this.page_index);
    this.RefreshList();
  }

  public ngOnDestroy(): void {

  }

  focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }


  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, { windowClass: 'sidepanel sidepanel-fade', size: 'side-40', backdropClass: 'light-blue-backdrop' }).result.then((Result) => {

      if (Result == 1) {

      }
      else {

      }


    }).catch(() => {

    });
  }

}
