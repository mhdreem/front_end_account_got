import { DOCUMENT } from "@angular/common";
import { Component, OnDestroy, OnChanges, Input, Output, EventEmitter, Inject, SimpleChanges } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Observable, Subscription, forkJoin, of } from "rxjs";
import { account_center } from "src/app/modules/shared/models/account_center";
import { accounts_tree } from "src/app/modules/shared/models/accounts_tree";
import { account_centerService } from "src/app/modules/shared/services/account-center.service";
import { AccountTreeService } from "src/app/modules/shared/services/account-tree.service";
import { FormValidationHelpersService } from "src/app/modules/shared/services/form-validation-helpers.service";

@Component({
  selector: 'app-payment-order-details',
  templateUrl: './payment-order-details.component.html',
  styleUrls: ['./payment-order-details.component.scss']
})
export class PaymentOrderDetailsComponent  implements OnDestroy, OnChanges {


  @Input() formGroup: FormGroup;
  @Input() name: string;
  @Input() FormArray?: any[] = [];
  @Output() OnNew: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnDelete: EventEmitter<any> = new EventEmitter<any>();

  accounts_tree_list: accounts_tree[];
  accounts_tree_filter: Observable<accounts_tree[]>;
  account_center_list: account_center[];
  account_center_filter: Observable<account_center[]>;
  LoadingFinish: boolean;

  _Subscription!: Subscription;



  constructor(

    @Inject(DOCUMENT) private _document: Document,
    private accountTreeService: AccountTreeService,
    private account_centerService: account_centerService,
    private formValidatorsService: FormValidationHelpersService,
  ) {
    this.LoadingFinish = true;
    this.Load_Data();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['formGroup'] != null) {
      this.formGroup = changes['formGroup'].currentValue;
    }

    if (changes != null && changes['FormArray'] != null) {
      this.FormArray = changes['FormArray'].currentValue;

    }

    if (changes != null && changes['name'] != null) {
      this.name = changes['name'].currentValue;
    }
  }


  ngOnDestroy(): void {
    if (this._Subscription != null)
      this._Subscription.unsubscribe();
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
      return this.accountTreeService.list_account_tree();
    return of(this.accountTreeService.List_AccountsTree);
  }

  Load_Account_Center(): Observable<account_center[]> {
    if (this.account_centerService.List_account_center == null ||
      this.account_centerService.List_account_center == undefined ||
      this.account_centerService.List_account_center.length == 0)
      return this.account_centerService.list();
    return of(this.account_centerService.List_account_center);
  }
















  delete(index: number) {
    this.OnDelete.emit(index)
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

  onKeypressEvent($event: any, isDebtor: boolean, FormGroup: FormGroup) {
    if ($event.target.value == '0' &&
      isDebtor &&
      this.getControls('debtor', FormGroup) != null
    )
      this.getControls('debtor', FormGroup).setValue(null);
    else if ($event.target.value == '0' &&
      !isDebtor &&
      this.getControls('creditor', FormGroup) != null
    )
      this.getControls('creditor', FormGroup).setValue(null);


  }
  key_enter_event(_index: number) {
    if (this.FormArray?.length != null &&
      _index == this.FormArray?.length - 1) {
      this.OnNew.emit(_index);
    }
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
  
  onFocusOutEvent(isDebtor: boolean, FormGroup: any) {
    var x = this.getControls('debtor', FormGroup) as FormControl;
    var xvcx = this.getControls('debtor', FormGroup).value;

    if (isDebtor &&
      this.getControls('debtor', FormGroup) != null &&
      this.getControls('creditor', FormGroup) != null &&
      this.getControls('debtor', FormGroup).value > 0
    )
      this.getControls('creditor', FormGroup).setValue(0);
    else if (!isDebtor &&
      this.getControls('debtor', FormGroup) != null &&
      this.getControls('creditor', FormGroup) != null &&
      this.getControls('creditor', FormGroup).value > 0
    )
      this.getControls('debtor', FormGroup).setValue(0);

  }

  account_tree_select($event: any) {

    if (
      this.getControls('accounts_tree_fk', FormGroup) != null &&
      this.getControls('accounts_tree_fk', FormGroup).value > 0
    ) {
      var arrs = this.accounts_tree_list.filter(x => x.seq == this.getControls('accounts_tree_fk', FormGroup).value);
      if (arrs != null && arrs.length > 0) {
        this.getControls('accounts_tree', FormGroup).setValue(arrs[0]);

      }
    }
  }

  account_center_select($event: any) {

    if (
      this.getControls('account_center_fk', FormGroup) != null &&
      this.getControls('account_center_fk', FormGroup).value > 0
    ) {
      var arrs = this.account_center_list.filter(x => x.account_center_seq == this.getControls('account_center_fk', FormGroup).value);
      if (arrs != null && arrs.length > 0) {
        this.getControls('account_center', FormGroup).setValue(arrs[0]);

      }
    }
  }

}
