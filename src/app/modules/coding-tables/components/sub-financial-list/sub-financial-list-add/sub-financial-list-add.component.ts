import { DOCUMENT } from "@angular/common";
import { Component, OnInit, OnDestroy, HostListener, Optional, Inject } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";
import { result } from "src/app/modules/shared/models/result";
import { sub_financial_list } from "src/app/modules/shared/models/sub_financial_list";
import { FormValidationHelpersService } from "src/app/modules/shared/services/form-validation-helpers.service";
import { validateSubFinalListName } from "./Validators/validateSubFinalListName";
import { SubFinancialListService } from "src/app/modules/shared/services/sub_financial_list.service";
import { account_center } from "src/app/modules/shared/models/account_center";
import { account_centerService } from "src/app/modules/shared/services/account-center.service";

@Component({
  selector: 'app-sub-financial-list-add',
  templateUrl: './sub-financial-list-add.component.html',
  styleUrls: ['./sub-financial-list-add.component.scss']
})

export class SubFinancialListAddComponent implements OnInit, OnDestroy {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 120) {
      event.preventDefault();
      this.save();
    }

  }
  _selected_sub_financial_list: sub_financial_list = {};
  set selected_sub_financial_list(obj: sub_financial_list) {
    this._selected_sub_financial_list = obj;
    this.setValue();
  }
  get selected_sub_financial_list(): sub_financial_list {
    return this._selected_sub_financial_list;
  }

  var_undifined?: number = undefined;

  Form: FormGroup;
  sub_financial_list_seq: FormControl<number | null>;
  sub_financial_list_name: FormControl<string | null>;
  direct_cost_center_fk: FormControl<number | null>;
  indirect_cost_center_fk: FormControl<number | null>;



  list_account_center: account_center[] = [];

  Subscriptions: Subscription[] = [];

  constructor(private frmBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SubFinancialListAddComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private accountCenterService: account_centerService,
    private SubFinancialListService: SubFinancialListService,
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar: MatSnackBar
  ) {

    this.BuildForm();



    this.load_accounts_center();

    if (this.data != null && this.data.obj != null)
      this.selected_sub_financial_list = this.data.obj;

  }

  ngOnDestroy(): void {
    if (this.Subscriptions != null && this.Subscriptions.length > 0)
      this.Subscriptions.forEach(element => {
        element.unsubscribe();
      });
  }




  load_accounts_center() {
    this.Subscriptions.push(
      this.accountCenterService.list().subscribe(
        res => {
          this.list_account_center = res;
        }
      )
    );

  }


  BuildForm() {
    this.Form = this.frmBuilder.group(
      {
        'sub_financial_list_seq': this.sub_financial_list_seq = new FormControl<number | null>(null, []),
        'sub_financial_list_name': this.sub_financial_list_name = new FormControl<string | null>(null, [Validators.required]),
        'direct_cost_center_fk': this.direct_cost_center_fk = new FormControl<number | null>(null, []),
        'indirect_cost_center_fk': this.indirect_cost_center_fk = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue() {
    if (this.Form != null) {
      if (this.selected_sub_financial_list!.sub_financial_list_seq! != null)
        this.sub_financial_list_seq.setValue(this.selected_sub_financial_list!.sub_financial_list_seq);

      if (this.selected_sub_financial_list!.sub_financial_list_name! != null)
        this.sub_financial_list_name.setValue(this.selected_sub_financial_list!.sub_financial_list_name);


      if (this.selected_sub_financial_list!.direct_cost_center_fk! != null)
        this.direct_cost_center_fk.setValue(this.selected_sub_financial_list!.direct_cost_center_fk);
      else this.direct_cost_center_fk.setValue(-1);

      if (this.selected_sub_financial_list!.indirect_cost_center_fk! != null)
        this.indirect_cost_center_fk.setValue(this.selected_sub_financial_list!.indirect_cost_center_fk);
    }
  }

  getValue() {
    console.log('this.Form.value', this.Form.value);
    if (this.Form != null) {

      if (this.sub_financial_list_name.value != null)
        this.selected_sub_financial_list.sub_financial_list_name = this.sub_financial_list_name.value;


      if (this.sub_financial_list_name.value != null)
        this.selected_sub_financial_list.sub_financial_list_name = this.sub_financial_list_name.value;



      if (this.direct_cost_center_fk.value != null && this.direct_cost_center_fk.value != -1)
        this.selected_sub_financial_list.direct_cost_center_fk = this.direct_cost_center_fk.value;
      else this.selected_sub_financial_list.direct_cost_center_fk = undefined;


      if (this.indirect_cost_center_fk.value != null && (this.indirect_cost_center_fk.value + "") != "")
        this.selected_sub_financial_list.indirect_cost_center_fk = this.indirect_cost_center_fk.value;



    }
  }

  ResetForm() {
    this.Form.reset();
    this.focusNext('sub_financial_list_parent_fk');
  }

  save() {
    if (this.Form.valid == false) {
      //print error using snaker
    }
    this.getValue();

    if (this.direct_cost_center_fk.value == -1)
      this.direct_cost_center_fk.setValue(null);

    if (this.indirect_cost_center_fk.value == -1)
      this.indirect_cost_center_fk.setValue(null);



    if (this.selected_sub_financial_list.sub_financial_list_seq! != null) {
      this.SubFinancialListService.update(this.Form.value).subscribe(
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
    } else if (this.selected_sub_financial_list.sub_financial_list_seq == null) {
      console.log('this.Form.value', this.Form.value);

      this.SubFinancialListService.add(this.Form.value).subscribe(
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
    this.sub_financial_list_name.addAsyncValidators([validateSubFinalListName(this.SubFinancialListService)]);
    
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
