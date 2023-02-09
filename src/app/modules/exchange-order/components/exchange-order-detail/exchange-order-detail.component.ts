import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { PageSanadKidService } from 'src/app/modules/sanad-kid/pageservice/page-sanad-kid.service';
import { account_center } from 'src/app/modules/shared/models/account-center';
import { accounts_tree } from 'src/app/modules/shared/models/account-tree';
import { ExchangeOrderDetails } from 'src/app/modules/shared/models/exchange-order-details';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { PageExchangeOrderService } from '../../pageservice/page-exchange-order.service';
import { validate_account_tree } from '../../../sanad-kid/components/sanad-kid-detail/validators/validate_account_tree';

@Component({
  selector: 'app-exchange-order-detail',
  templateUrl: './exchange-order-detail.component.html',
  styleUrls: ['./exchange-order-detail.component.scss']
})
export class ExchangeOrderDetailComponent {
  _index: number;
  @Output() onDelete: EventEmitter<number> = new EventEmitter();

  @Input() set index(i: number) {
    this._index = i;
  }
  get exchange_order_details(): ExchangeOrderDetails {
    if (
      this.PageExchangeOrderService.exchange_order != null &&
      this.PageExchangeOrderService.exchange_order.exchange_order_details != null &&
      this._index >= 0 &&
      this._index < this.PageExchangeOrderService.exchange_order.exchange_order_details?.length) {
      // console.log('this.PageSanadKidService.sanad_kid', this.PageExchangeOrderService.sanad_kid);
      // console.log('this.index', this.index);
      return this.PageExchangeOrderService.exchange_order.exchange_order_details[this._index];
    }
    return {};
  }

  set exchange_order_details(obj: ExchangeOrderDetails) {
    if (
      this.PageExchangeOrderService.exchange_order != null &&
      this.PageExchangeOrderService.exchange_order.exchange_order_details != null &&
      this._index >= 0 &&
      this._index <= this.PageExchangeOrderService.exchange_order.exchange_order_details?.length) {
      this.PageExchangeOrderService.exchange_order.exchange_order_details[this.index] = obj;
    }

  }

  _Subscription!: Subscription;

  Form!: FormGroup;
  seq!: FormControl<number | null>;
  exchange_order_fk!: FormControl<number | null>;
  debtor!: FormControl<number | null>;
  creditor!: FormControl<number | null>;
  account_id!: FormControl<number | null>;
  accounts_tree_fk!: FormControl<number | null>;
  accounts_tree!: FormControl<accounts_tree | null>;
  account_center_fk!: FormControl<number | null>;
  account_center!: FormControl<account_center | null>;
  account_notice!: FormControl<string | null>;


  accounts_tree_list: accounts_tree[];
  accounts_tree_filter: Observable<accounts_tree[]>;
  account_center_list: account_center[];
  account_center_filter: Observable<account_center[]>;

  LoadingFinish: boolean;

  constructor(
    private fb: FormBuilder,
    private PageExchangeOrderService: PageExchangeOrderService,
    private PageSanadKidService: PageSanadKidService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private accountTreeService: AccountTreeService,
    private account_centerService: account_centerService,
    private formValidatorsService: FormValidationHelpersService,
  ) {
    this.LoadingFinish = true;
    this.BuildForm();
    this.Load_Data();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['index'] != null) {
      this.index = changes['index'].currentValue;
    }
    if (changes != null && changes['index'] != null) {
      this.SetValue();
      this.bindModelToForm(this.exchange_order_details, this.Form);

    }

  }



  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'seq': this.seq = new FormControl<number | null>(null, [Validators.required]),
          'exchange_order_fk': this.exchange_order_fk = new FormControl<number | null>(null, [Validators.required]),
          'debtor': this.debtor = new FormControl<number | null>(null, []),
          'creditor': this.creditor = new FormControl<number | null>(null, []),
          'accounts_tree_fk': this.accounts_tree_fk = new FormControl<number | null>(null, [Validators.required]),
          'accounts_tree': this.accounts_tree = new FormControl<accounts_tree | null>(null, []),
          'account_center_fk': this.account_center_fk = new FormControl<number | null>(null, []),
          'account_center': this.account_center = new FormControl<account_center | null>(null, []),
          'account_notice': this.account_notice = new FormControl<string | null>(null, [])

        },
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    this.LoadingFinish = false;
    this._Subscription = forkJoin(
      this.Load_Account_Tree(),
      this.Load_Account_Center()
    ).subscribe(
      res => {
        this.accounts_tree_list = res[0];
        this.accounts_tree_filter = of(this.accounts_tree_list);
        this.accountTreeService.List_AccountsTree = this.accounts_tree_list;
        this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.accountTreeService.List_AccountsTree);

        this.account_center_list = res[1];
        this.account_center_filter = of(this.account_center_list);
        this.account_centerService.List_account_center = this.account_center_list;
        this.account_centerService.List_account_center_BehaviorSubject.next(this.account_center_list);


        this.LoadingFinish = true;

      }
    )
  }

  Load_Account_Tree(): Observable<accounts_tree[]> {
    if (this.accountTreeService.List_AccountsTree == null ||
      this.accountTreeService.List_AccountsTree == undefined ||
      this.accountTreeService.List_AccountsTree.length == 0)
      return this.accountTreeService.list();
    return of(this.accountTreeService.List_AccountsTree);
  }

  Load_Account_Center(): Observable<account_center[]> {
    if (this.account_centerService.List_account_center == null ||
      this.account_centerService.List_account_center == undefined ||
      this.account_centerService.List_account_center.length == 0)
      return this.account_centerService.list();
    return of(this.account_centerService.List_account_center);
  }





  public async Init_AutoComplete() {
    try {
      this.accounts_tree_filter = this.accounts_tree.valueChanges
        .pipe(
          startWith(''),
          map((value) => value && typeof value === 'string' ? this._filter_Account_Tree(value) : this.accounts_tree_list.slice())
        );

      this.account_center_filter = this.account_center.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filter_Account_Center(value) : this.account_center_list.slice())
        );



    } catch (Exception: any) { }
  }


  private _filter_Account_Tree(value: string): accounts_tree[] {
    const filterValue = value.toLowerCase();
    return this.accounts_tree_list.filter(option => (option.account_id != null && option.account_name != null) && (option.account_id.includes(filterValue) || option.account_name.includes(filterValue)));
  }


  private _filter_Account_Center(value: string): account_center[] {
    const filterValue = value.toLowerCase();
    return this.account_center_list.filter(option => (option.account_center_id != null && option.account_center_name != null) && (option.account_center_id.toString().includes(filterValue) || option.account_center_name.includes(filterValue)));
  }



  public display_Account_Tree_Property(value: accounts_tree): string {
    if (value && value.account_name) {
      return value.account_id + " - " + value.account_name;
    }
    return '';
  }



  public display_Account_Center_Property(value: account_center): string {
    if (value && value.account_center_name) {
      return value.account_center_name;
    }
    return '';
  }






  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  ngOnInit() {
    this.accounts_tree_fk.addAsyncValidators([validate_account_tree(this.PageSanadKidService, this.accounts_tree_fk.value)])
  }

  public SetValue() {
    try {


      if (this.exchange_order_details != null && this.exchange_order_details?.seq != null)
        this.seq.setValue(this.exchange_order_details.seq);

      if (this.exchange_order_details != null && this.exchange_order_details.account_center_fk != null)
        this.account_center_fk.setValue(this.exchange_order_details.account_center_fk);

      if (this.exchange_order_details != null && this.exchange_order_details.exchange_order_fk != null)
        this.exchange_order_fk.setValue(this.exchange_order_details.exchange_order_fk);

      if (this.exchange_order_details != null && this.exchange_order_details.debtor != null)
        this.debtor.setValue(this.exchange_order_details.debtor);

      if (this.exchange_order_details != null && this.exchange_order_details.creditor != null)
        this.creditor.setValue(this.exchange_order_details.creditor);

      if (this.exchange_order_details != null && this.exchange_order_details.accounts_tree_fk != null)
        this.accounts_tree_fk.setValue(this.exchange_order_details.accounts_tree_fk);

      if (this.exchange_order_details != null && this.exchange_order_details.account_notice != null)
        this.account_notice.setValue(this.exchange_order_details.account_notice);


    } catch (ex: any) {


    }

  }

  getValue() {
    if (this.exchange_order_details != null && this.seq.value != null)
      this.exchange_order_details.seq = this.seq.value;

    if (this.exchange_order_details != null && this.account_center_fk.value != null)
      this.exchange_order_details.account_center_fk = this.account_center_fk.value;

    if (this.exchange_order_details != null && this.exchange_order_fk.value != null)
      this.exchange_order_details.exchange_order_fk = this.exchange_order_fk.value;

    if (this.exchange_order_details != null && this.debtor.value != null)
      this.exchange_order_details.debtor = this.debtor.value;

    if (this.exchange_order_details != null && this.creditor.value != null)
      this.exchange_order_details.creditor = this.creditor.value;

    if (this.exchange_order_details != null && this.accounts_tree_fk.value != null)
      this.exchange_order_details.accounts_tree_fk = this.accounts_tree_fk.value;

    if (this.exchange_order_details != null && this.account_notice.value != null)
      this.exchange_order_details.account_notice = this.account_notice.value;

  }

  Reset(): void {

  }

  clear() {
    this.Form.reset();
  }

  //auto bind 

  focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  delete() {
    this.onDelete.emit(this._index)
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

  onAccountNameFilling() {
    if ((this.accounts_tree_fk.value + '')[0] == '3')
      this.account_center.addValidators([Validators.required]);

    console.log('this.accounts_tree.errors', this.accounts_tree_fk.errors);
    console.log('details', this.exchange_order_details);
  }

  onCreditorFilling() {
    this.debtor.setValue(0);
  }

  onDebtorFilling() {
    this.creditor.setValue(0);
  }

  onAccountNameSelecting(account: any) {
    this.accounts_tree = account;
  }

  onAccountCenterSelecting(center: any) {
    this.account_center = center;
  }

  public fieldHasErrors(form: any, field: string) {
    return this.formValidatorsService.fieldHasErrors(form, field);
  }


  public autoPrintFirstErrorMessage(
    form: any,
    controlName: string,
    label: string,
    isFemale?: boolean
  ): string {
    return this.formValidatorsService.autoPrintFirstErrorMessage(form, controlName, label, isFemale);
  }
}
