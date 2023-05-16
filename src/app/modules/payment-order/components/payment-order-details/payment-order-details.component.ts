import { DOCUMENT } from '@angular/common';
import { Component, HostListener, EventEmitter, Inject, Input, OnDestroy, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { PageSanadKidService } from 'src/app/modules/sanad-kid/pageservice/page-sanad-kid.service';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { payment_order_detail } from 'src/app/modules/shared/models/payment_order_detail';
import { PagePaymentOrderService } from '../../pageservice/page-payment-order.service';
import { validate_account_tree } from './validators/validate_account_tree';

@Component({
  selector: 'app-payment-order-details',
  templateUrl: './payment-order-details.component.html',
  styleUrls: ['./payment-order-details.component.scss']
})
export class PaymentOrderDetailsComponent  implements OnDestroy,OnChanges{
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // enter
    if(event.keyCode == 13){
      event.preventDefault();
    }
  }
  
  _index: number;
  @Output() onDelete: EventEmitter<number> = new EventEmitter();
  @Output() updateSum: EventEmitter<number> = new EventEmitter();

  @Input() set index(i: number) {
    this._index = i;
  }
  get index():number
  {
    return this._index;
  }
  
  _payment_order_detail:payment_order_detail;

  get payment_order_detail(): payment_order_detail {
   return this._payment_order_detail;

  }

  @Input() set payment_order_detail(obj: payment_order_detail) {
     this._payment_order_detail = obj;
  }

  _Subscription!: Subscription;

  Form!: FormGroup;
  seq!: FormControl<number | null>;
  payment_order_fk!: FormControl<number | null>;
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
    private PagePaymentOrderService: PagePaymentOrderService,
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
      // load data must executed before set value
      this.Load_Data();
      //this.SetValue();
      this.bindModelToForm(this.payment_order_detail, this.Form);

    }

  }

  bindModelToForm(model: any, form: FormGroup) {
    if (model == null || form == null)
      return;
    const keys = Object.keys(form.controls);
    keys.forEach(key => {

      form.controls[key].valueChanges.subscribe(
        (newValue) => {
          if (typeof model[key] === "number")
              model[key] = +newValue;            
            else 
              model[key] = newValue;

        }
      )
    });
  }

  ngOnDestroy(): void {
    if (this._Subscription!= null)
      this._Subscription.unsubscribe();
  }

  ngOnInit() {
    this.accounts_tree_fk.addAsyncValidators([validate_account_tree(this.PagePaymentOrderService, this.accounts_tree_fk.value)])
  }



  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'seq': this.seq = new FormControl<number | null>(null, [Validators.required]),
          'payment_order_fk': this.payment_order_fk = new FormControl<number | null>(null, [Validators.required]),
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

        this.SetValue();
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
    if (value && this.accounts_tree_list) {
      let account: any = this.accounts_tree_list.find(account => account.seq!.toString() == value);
      if (account)
        return account.account_id + " - " + account.account_name!;

    }
    return '';
  }



  public display_Account_Center_Property(value: account_center): string {
    if (value && this.account_center_list) {
      let center: any = this.account_center_list.find(center => center.account_center_seq!.toString() == value);
      if (center)
        return center.account_center_name!;

    }
    return '';

  }






  public SetValue() {
    try {


      if (this.payment_order_detail != null && this.payment_order_detail?.seq != null)
        this.seq.setValue(this.payment_order_detail.seq);

      if (this.payment_order_detail != null && this.payment_order_detail.account_center_fk != null)
        this.account_center_fk.setValue(this.payment_order_detail.account_center_fk);

        if (this.payment_order_detail != null && this.payment_order_detail.account_center != null)
        this.account_center.setValue(this.payment_order_detail.account_center);


      if (this.payment_order_detail != null && this.payment_order_detail.payment_order_fk != null)
        this.payment_order_fk.setValue(this.payment_order_detail.payment_order_fk);

      if (this.payment_order_detail != null && this.payment_order_detail.debtor != null)
        this.debtor.setValue(this.payment_order_detail.debtor);

      if (this.payment_order_detail != null && this.payment_order_detail.creditor != null)
        this.creditor.setValue(this.payment_order_detail.creditor);

      if (this.payment_order_detail != null && this.payment_order_detail.accounts_tree_fk != null)
        this.accounts_tree_fk.setValue(this.payment_order_detail.accounts_tree_fk);

        if (this.payment_order_detail != null && this.payment_order_detail.accounts_tree != null)
        this.accounts_tree.setValue(this.payment_order_detail.accounts_tree);


      if (this.payment_order_detail != null && this.payment_order_detail.account_notice != null)
        this.account_notice.setValue(this.payment_order_detail.account_notice);


    } catch (ex: any) {


    }

  }

  getValue() {
    if (this.payment_order_detail != null && this.seq.value != null)
      this.payment_order_detail.seq = this.seq.value;

    if (this.payment_order_detail != null && this.account_center_fk.value != null)
      this.payment_order_detail.account_center_fk = this.account_center_fk.value;

    if (this.payment_order_detail != null && this.payment_order_fk.value != null)
      this.payment_order_detail.payment_order_fk = this.payment_order_fk.value;

    if (this.payment_order_detail != null && this.debtor.value != null)
      this.payment_order_detail.debtor = this.debtor.value;

    if (this.payment_order_detail != null && this.creditor.value != null)
      this.payment_order_detail.creditor = this.creditor.value;

    if (this.payment_order_detail != null && this.accounts_tree_fk.value != null)
      this.payment_order_detail.accounts_tree_fk = this.accounts_tree_fk.value;

    if (this.payment_order_detail != null && this.account_notice.value != null)
      this.payment_order_detail.account_notice = this.account_notice.value;

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

  


  onCreditorFilling() {
    this.debtor.setValue(0);
    this.updateSum.emit();

  }


  onDebtorFilling() {
    this.creditor.setValue(0);
    this.updateSum.emit();

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



  Select_Accounts_Tree_Option(event: any) {

    const selectedValue = event.option.value;

    if (selectedValue != null) {

      var accounts_trees = this.accounts_tree_list.filter(x => x.seq == selectedValue);
      if (accounts_trees != null && accounts_trees.length > 0) {
        this.accounts_tree.setValue(accounts_trees[0]);
        if (accounts_trees[0].account_id?.toString().charAt(0)  == '3')
          this.account_center_fk.addValidators([Validators.required]);
        else 
          this.account_center_fk.setValidators([]);
  
  
      }

    }

  }


  Select_Account_Center_Option(event: any) {

    const selectedValue = event.option.value;

    if (selectedValue != null) {

      var account_centers = this.account_center_list.filter(x => x.account_center_seq == selectedValue);
      if (account_centers != null && account_centers.length > 0) {
        this.account_center.setValue(account_centers[0]);
      }

    }

  }

}
