import { ObserversModule } from '@angular/cdk/observers';
import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import { sanad_kid_detail } from 'src/app/modules/shared/models/sanad_kid_detail';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { PageSanadKidService } from '../../pageservice/page-sanad-kid.service';
import { validate_account_tree } from './validators/validate_account_tree';

@Component({
  selector: 'app-sanad-kid-detail',
  templateUrl: './sanad-kid-detail.component.html',
  styleUrls: ['./sanad-kid-detail.component.scss']
})
export class SanadKidDetailComponent implements OnChanges, OnDestroy, OnInit {
  _index: number;
  @Output() onDelete: EventEmitter<number> = new EventEmitter();

  @Input() set index(i: number) {
    this._index = i;
  }
  get sanad_kid_detail(): sanad_kid_detail {
    if (
      this.PageSanadKidService.sanad_kid != null &&
      this.PageSanadKidService.sanad_kid.sanad_kid_details != null &&
      this._index >= 0 &&
      this._index < this.PageSanadKidService.sanad_kid.sanad_kid_details?.length) {
      console.log('this.PageSanadKidService.sanad_kid', this.PageSanadKidService.sanad_kid);
      console.log('this.index', this.index);
      return this.PageSanadKidService.sanad_kid.sanad_kid_details[this._index];
    }
    return {};
  }

  set sanad_kid_detail(obj: sanad_kid_detail) {
    if (
      this.PageSanadKidService.sanad_kid != null &&
      this.PageSanadKidService.sanad_kid.sanad_kid_details != null &&
      this._index >= 0 &&
      this._index <= this.PageSanadKidService.sanad_kid.sanad_kid_details?.length) {
      this.PageSanadKidService.sanad_kid.sanad_kid_details[this.index] = obj;
    }

  }

  _Subscription!: Subscription;

  Form!: FormGroup;
  seq!: FormControl<number | null>;
  Sanad_Kid_fk!: FormControl<number | null>;
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
      this.bindModelToForm(this.sanad_kid_detail, this.Form);

    }

  }



  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'seq': this.seq = new FormControl<number | null>(null, [Validators.required]),
          'Sanad_Kid_fk': this.Sanad_Kid_fk = new FormControl<number | null>(null, [Validators.required]),
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






  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  ngOnInit() {
    this.accounts_tree_fk.addAsyncValidators([validate_account_tree(this.PageSanadKidService, this.accounts_tree_fk.value)])
  }

  public SetValue() {
    try {


      if (this.sanad_kid_detail != null && this.sanad_kid_detail?.seq != null)
        this.seq.setValue(this.sanad_kid_detail.seq);

      if (this.sanad_kid_detail != null && this.sanad_kid_detail.account_center_fk != null)
        this.account_center_fk.setValue(this.sanad_kid_detail.account_center_fk);

      if (this.sanad_kid_detail != null && this.sanad_kid_detail.sanad_Kid_fk != null)
        this.Sanad_Kid_fk.setValue(this.sanad_kid_detail.sanad_Kid_fk);

      if (this.sanad_kid_detail != null && this.sanad_kid_detail.debtor != null)
        this.debtor.setValue(this.sanad_kid_detail.debtor);

      if (this.sanad_kid_detail != null && this.sanad_kid_detail.creditor != null)
        this.creditor.setValue(this.sanad_kid_detail.creditor);

      if (this.sanad_kid_detail != null && this.sanad_kid_detail.accounts_tree_fk != null)
        this.accounts_tree_fk.setValue(this.sanad_kid_detail.accounts_tree_fk);

      if (this.sanad_kid_detail != null && this.sanad_kid_detail.account_notice != null)
        this.account_notice.setValue(this.sanad_kid_detail.account_notice);


    } catch (ex: any) {


    }

  }

  getValue() {
    if (this.sanad_kid_detail != null && this.seq.value != null)
      this.sanad_kid_detail.seq = this.seq.value;

    if (this.sanad_kid_detail != null && this.account_center_fk.value != null)
      this.sanad_kid_detail.account_center_fk = this.account_center_fk.value;

    if (this.sanad_kid_detail != null && this.Sanad_Kid_fk.value != null)
      this.sanad_kid_detail.sanad_Kid_fk = this.Sanad_Kid_fk.value;

    if (this.sanad_kid_detail != null && this.debtor.value != null)
      this.sanad_kid_detail.debtor = this.debtor.value;

    if (this.sanad_kid_detail != null && this.creditor.value != null)
      this.sanad_kid_detail.creditor = this.creditor.value;

    if (this.sanad_kid_detail != null && this.accounts_tree_fk.value != null)
      this.sanad_kid_detail.accounts_tree_fk = this.accounts_tree_fk.value;

    if (this.sanad_kid_detail != null && this.account_notice.value != null)
      this.sanad_kid_detail.account_notice = this.account_notice.value;

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
    if (this.accounts_tree_fk == null)
      return;
    this.account_center.addValidators([]);
    if (
      this.accounts_tree_fk.value != null &&
      this.accounts_tree_fk.value.toString().charAt(0) == '3')
      this.account_center.addValidators([Validators.required]);


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
