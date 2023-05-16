import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';


import { result } from 'src/app/modules/shared/models/result';
import { FinanceListService } from 'src/app/modules/shared/services/finance-list.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateFinanceListName } from '../../finance-list/finance-list-add/Validators/validateFinanceListName';
import { FinanceListAddComponent } from '../../finance-list/finance-list-add/finance-list-add.component';
import { PaymentSafeService } from 'src/app/modules/shared/services/payment_safe.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { payment_safe } from 'src/app/modules/shared/models/payment_safe';
import { validatePaymentSafetName } from './Validators/validatePaymentSafetName';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';

@Component({
  selector: 'app-payment_safe-add',
  templateUrl: './payment_safe-add.component.html',
  styleUrls: ['./payment_safe-add.component.scss']
})
export class PaymentSafeAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 120) {
      event.preventDefault();
      this.save();
    }

  }
  _selected_payment_safe: payment_safe = {};
  set selected_payment_safe(obj: payment_safe) {
    this._selected_payment_safe = obj;
    this.setValue();
  }
  get selected_payment_safe(): payment_safe {
    return this._selected_payment_safe;
  }

  Form: FormGroup;
  payment_safe_seq: FormControl<number | null>;
  payment_safe_name: FormControl<string | null>;
  payment_safe_order: FormControl<number | null>;
  accounts_tree_fk: FormControl<number | null>;


  list_account_tree :accounts_tree[]=[];

  Subscription: Subscription = new Subscription();

  constructor(private frmBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FinanceListAddComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private PaymentSafeService: PaymentSafeService,
    private AccountTreeService: AccountTreeService,

    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar: MatSnackBar
  ) {

    this.BuildForm();

    this.AccountTreeService.list().subscribe(
      res=>
      {
        this.list_account_tree  = res as accounts_tree[];
        
      }
    )

    if (this.data != null && this.data.obj != null)
      this.selected_payment_safe = this.data.obj;

  }

  ngOnDestroy(): void {
    if (this.Subscription != null) this.Subscription.unsubscribe();
  }

  BuildForm() {
    this.Form = this.frmBuilder.group(
      {
        'payment_safe_seq': this.payment_safe_seq = new FormControl<number | null>(null, []),
        'payment_safe_name': this.payment_safe_name = new FormControl<string | null>(null, [Validators.required]),
        'payment_safe_order': this.payment_safe_order = new FormControl<number | null>(null, []),
        'accounts_tree_fk': this.accounts_tree_fk = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue() {
    if (this.Form != null) {
      if (this.selected_payment_safe!.payment_safe_seq! != null)
        this.payment_safe_seq.setValue(this.selected_payment_safe!.payment_safe_seq);

      if (this.selected_payment_safe!.payment_safe_name! != null)
        this.payment_safe_name.setValue(this.selected_payment_safe!.payment_safe_name);

      if (this.selected_payment_safe!.payment_safe_order! != null)
        this.payment_safe_order.setValue(this.selected_payment_safe!.payment_safe_order);

        if (this.selected_payment_safe!.accounts_tree_fk! != null)
        this.accounts_tree_fk.setValue(this.selected_payment_safe!.accounts_tree_fk);

    }
  }

  getValue() {
    console.log('this.Form.value', this.Form.value);
    if (this.Form != null) {


      if (this.payment_safe_name.value != null)
        this.selected_payment_safe.payment_safe_name = this.payment_safe_name.value;

      if (this.payment_safe_order.value != null && (this.payment_safe_order.value + "") != "")
        this.selected_payment_safe.payment_safe_order = this.payment_safe_order.value;

    }
  }

  ResetForm()
  {
    this.Form.reset();
    this.focusNext('payment_safe_name')
  }

  save() {
    if (this.Form.valid == false) {
      //print error using snaker
    }
    this.getValue();

    if (this.selected_payment_safe.payment_safe_seq! != null) {
      this.PaymentSafeService.update(this.Form.value).subscribe(
        res => {
          if (res != null && (res as result) != null && (res as result).success) {
            this.SnackBar.open('تم التعديل بنجاح', '', { duration: 3000, panelClass: ['green-snackbar'] });
            this.ResetForm();
          } else {
            this.SnackBar.open('لم يتم التعديل بنجاح', '', { panelClass: ['red-snackbar'] });

          }

        },
        err => console.log('HTTP Error', err),

      )
    } else if (this.selected_payment_safe.payment_safe_seq == null) {
      console.log('this.Form.value', this.Form.value);

      this.PaymentSafeService.add(this.Form.value).subscribe(
        res => {
          console.log('res', res);
          if (res != null && (res as result) != null && (res as result).success) {
            this.SnackBar.open('تمت الإضافة بنجاح', '', { duration: 3000, panelClass: ['green-snackbar'] });
            this.ResetForm();
          } else {
            this.SnackBar.open('لم تتم الإضافة بنجاح', '', { panelClass: ['red-snackbar'] });
          }
        },
        err => console.log('HTTP Error', err),

      )
    }

  }


  closeDialog() {
    this.dialogRef.close({ event: 'إلغاء' });
  }

  ngOnInit(): void {
    this.payment_safe_name.addAsyncValidators([validatePaymentSafetName(this.PaymentSafeService, this.payment_safe_name.value)]);

  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
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
