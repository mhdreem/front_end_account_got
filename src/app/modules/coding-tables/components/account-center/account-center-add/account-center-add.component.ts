import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { result } from 'src/app/modules/shared/models/result';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateAccountCenterId } from './Validators/validateAccountCenterId';
import { validateAccountCenterName } from './Validators/validateAccountCenterName';

@Component({
  selector: 'app-account-center-add',
  templateUrl: './account-center-add.component.html',
  styleUrls: ['./account-center-add.component.scss']
})

export class AccountCenterAddComponent implements OnInit , OnDestroy {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_account_center:account_center= {};
  set selected_account_center(obj:account_center)
  {
    this._selected_account_center =  obj;
    this.setValue();
  }
  get  selected_account_center():account_center
  {
    return this._selected_account_center ;
  }

  Form: FormGroup;
  account_center_seq: FormControl<number | null>;
  account_center_id: FormControl<number | null>;
  account_center_name: FormControl<string | null>;
  account_center_final_seq: FormControl<number | null>;
  account_center_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AccountCenterAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private accountCenterService: account_centerService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_account_center = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'account_center_seq': this.account_center_seq = new FormControl<number | null>(null, []),
        'account_center_id': this.account_center_id = new FormControl<number | null>(null, [Validators.required]),
        'account_center_name': this.account_center_name = new FormControl<string | null>(null, [Validators.required]),
        'account_center_final_seq': this.account_center_final_seq = new FormControl<number | null>(null, []),
        'account_center_order': this.account_center_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_account_center!.account_center_seq! != null)
        this.account_center_seq.setValue(this.selected_account_center!.account_center_seq);

        if (this.selected_account_center!.account_center_id! != null)
        this.account_center_id.setValue(this.selected_account_center!.account_center_id);

        if (this.selected_account_center!.account_center_name! != null)
        this.account_center_name.setValue(this.selected_account_center!.account_center_name);

        if (this.selected_account_center!.account_center_final_seq!!= null)
        this.account_center_final_seq.setValue(this.selected_account_center!.account_center_final_seq);

        if (this.selected_account_center!.account_center_order! != null)
        this.account_center_order.setValue(this.selected_account_center!.account_center_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {
      
        if (this.account_center_id.value!= null)
          this.selected_account_center.account_center_id = this.account_center_id.value;


          if (this.account_center_name.value!= null)
          this.selected_account_center.account_center_name = this.account_center_name.value;



          if (this.account_center_final_seq.value!= null)
          this.selected_account_center.account_center_final_seq = this.account_center_final_seq.value;

          if (this.account_center_order.value!= null && (this.account_center_order.value+ "") != "")
          this.selected_account_center.account_center_order = this.account_center_order.value;


       
        }
  }

  ResetForm()
  {
    this.Form.reset();
  }

  save()
  {
    if (this.Form.valid == false)
    {
      //print error using snaker
    }
    this.getValue();

    if (this.selected_account_center.account_center_seq!!= null)
    {
      this.accountCenterService.update(this.Form.value).subscribe(
        res => {
          if (res != null && (res as result)!= null &&  (res as result).success)
          {
            this.SnackBar.open('تم التعديل بنجاح','',{duration: 3000, panelClass: ['green-snackbar']});
            this.ResetForm();
          }else 
          {
            this.SnackBar.open('لم يتم التعديل بنجاح','',{ panelClass: ['red-snackbar']});
          
          }
          
        },
        err => console.log('HTTP Error', err),
      
      )
    }else if (this.selected_account_center.account_center_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.accountCenterService.add(this.Form.value).subscribe(
        res => {
          console.log('res',res);
          if (res != null && (res as result)!= null &&  (res as result).success)
          {
            this.SnackBar.open('تمت الإضافة بنجاح','',{duration: 3000, panelClass: ['green-snackbar']});
            this.ResetForm();
          }else 
          {
            this.SnackBar.open('لم تتم الإضافة بنجاح','',{panelClass: ['red-snackbar']});
          }
        },
        err => console.log('HTTP Error', err),
      
      )
    }

  }


  closeDialog(){
    // console.log('formgroup.controls',this.account_center_name.errors);
    this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.account_center_name.addAsyncValidators([validateAccountCenterName(this.accountCenterService)]);
    this.account_center_id.addAsyncValidators([validateAccountCenterId(this.accountCenterService)]);

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
