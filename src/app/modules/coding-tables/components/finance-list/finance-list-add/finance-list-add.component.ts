import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { finance_list } from 'src/app/modules/shared/models/finance-list';
import { result } from 'src/app/modules/shared/models/result';
import { FinanceListService } from 'src/app/modules/shared/services/finance-list.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateFinanceListName } from './Validators/validateFinanceListName';

@Component({
  selector: 'app-finance-list-add',
  templateUrl: './finance-list-add.component.html',
  styleUrls: ['./finance-list-add.component.scss']
})
export class FinanceListAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_finance_list:finance_list= {};
  set selected_finance_list(obj:finance_list)
  {
    this._selected_finance_list =  obj;
    this.setValue();
  }
  get  selected_finance_list():finance_list
  {
    return this._selected_finance_list ;
  }

  Form: FormGroup;
  finance_list_seq: FormControl<number | null>;
  finance_list_name: FormControl<string | null>;
  finance_list_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<FinanceListAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private financeListService: FinanceListService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_finance_list = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'finance_list_seq': this.finance_list_seq = new FormControl<number | null>(null, []),
        'finance_list_name': this.finance_list_name = new FormControl<string | null>(null, [Validators.required]),
        'finance_list_order': this.finance_list_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_finance_list!.finance_list_seq!!= null)
        this.finance_list_seq.setValue(this.selected_finance_list!.finance_list_seq);

        if (this.selected_finance_list!.finance_list_name! != null)
        this.finance_list_name.setValue(this.selected_finance_list!.finance_list_name);

        if (this.selected_finance_list!.finance_list_order!!= null)
        this.finance_list_order.setValue(this.selected_finance_list!.finance_list_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.finance_list_name.value!= null)
          this.selected_finance_list.finance_list_name = this.finance_list_name.value;

          if (this.finance_list_order.value!= null)
          this.selected_finance_list.finance_list_order = this.finance_list_order.value;
       
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

    if (this.selected_finance_list.finance_list_seq!!= null)
    {
      this.financeListService.update(this.Form.value).subscribe(
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
    }else if (this.selected_finance_list.finance_list_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.financeListService.add(this.Form.value).subscribe(
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
    this.finance_list_name.addAsyncValidators([validateFinanceListName(this.financeListService, this.finance_list_name.value)]);

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
