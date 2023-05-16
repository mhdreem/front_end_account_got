import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { account_final } from 'src/app/modules/shared/models/account_final';
import { result } from 'src/app/modules/shared/models/result';
import { AccountFinalService } from 'src/app/modules/shared/services/account-final.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateAccountFinalName } from './Validators/validateAccountFinalName';

@Component({
  selector: 'app-account-final-add',
  templateUrl: './account-final-add.component.html',
  styleUrls: ['./account-final-add.component.scss']
})
export class AccountFinalAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_account_final:account_final= {};
  set selected_account_final(obj:account_final)
  {
    this._selected_account_final =  obj;
    this.setValue();
  }
  get  selected_account_final():account_final
  {
    return this._selected_account_final ;
  }

  Form: FormGroup;
  account_final_seq: FormControl<number | null>;
  account_final_name: FormControl<string | null>;
  account_final_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AccountFinalAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private accountFinalService: AccountFinalService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_account_final = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'account_final_seq': this.account_final_seq = new FormControl<number | null>(null, []),
        'account_final_name': this.account_final_name = new FormControl<string | null>(null, [Validators.required]),
        'account_final_order': this.account_final_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_account_final!.account_final_seq!!= null)
        this.account_final_seq.setValue(this.selected_account_final!.account_final_seq);

        if (this.selected_account_final!.account_final_name! != null)
        this.account_final_name.setValue(this.selected_account_final!.account_final_name);

        if (this.selected_account_final!.account_final_order!!= null)
        this.account_final_order.setValue(this.selected_account_final!.account_final_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.account_final_name.value!= null)
          this.selected_account_final.account_final_name = this.account_final_name.value;

          if (this.account_final_order.value!= null && (this.account_final_order.value+ "") != "")
          this.selected_account_final.account_final_order = this.account_final_order.value;
       
        }
  }

  ResetForm()
  {
    this.Form.reset();
    this.focusNext('account_final_name')
  }

  save()
  {
    if (this.Form.valid == false)
    {
      //print error using snaker
    }
    this.getValue();

    if (this.selected_account_final.account_final_seq!!= null)
    {
      this.accountFinalService.update(this.Form.value).subscribe(
        res => {
          if (res != null && (res as result)!= null &&  (res as result).success)
          {
            this.SnackBar.open('تم التعديل بنجاح','',{duration: 3000, panelClass: ['green-snackbar']});
            this.ResetForm();
          }else 
          {
            this.SnackBar.open('لم يتم التعديل بنجاح','',{panelClass: ['red-snackbar']});
          
          }
          
        },
        err => console.log('HTTP Error', err),
      
      )
    }else if (this.selected_account_final.account_final_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.accountFinalService.add(this.Form.value).subscribe(
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
    this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.account_final_name.addAsyncValidators([validateAccountFinalName(this.accountFinalService, this.account_final_name.value)]);

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
