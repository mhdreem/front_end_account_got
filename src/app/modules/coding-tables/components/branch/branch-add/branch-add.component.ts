import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { branch } from 'src/app/modules/shared/models/branch';
import { result } from 'src/app/modules/shared/models/result';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateBranchName } from './Validators/validateBranchName';

@Component({
  selector: 'app-branch-add',
  templateUrl: './branch-add.component.html',
  styleUrls: ['./branch-add.component.scss']
})
export class BranchAddComponent implements OnInit {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_branch:branch= {};
  set selected_branch(obj:branch)
  {
    this._selected_branch =  obj;
    this.setValue();
  }
  get  selected_branch():branch
  {
    return this._selected_branch ;
  }

  Form: FormGroup;
  branch_seq: FormControl<number | null>;
  branch_name: FormControl<string | null>;
  branch_address: FormControl<string | null>;
  branch_phone: FormControl<string | null>;
  branch_email: FormControl<string | null>;
  branch_website: FormControl<string | null>;
  branch_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<BranchAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private branchService: BranchService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this._selected_branch = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'branch_seq': this.branch_seq = new FormControl<number | null>(null, []),
        'branch_name': this.branch_name = new FormControl<string | null>(null, [Validators.required],),
        'branch_address': this.branch_address = new FormControl<string | null>(null, [Validators.required]),
        'branch_phone': this.branch_phone = new FormControl<string | null>(null, [Validators.required]),
        'branch_email': this.branch_email = new FormControl<string | null>(null, [Validators.required]),
        'branch_website': this.branch_website = new FormControl<string | null>(null, [Validators.required]),
        'branch_order': this.branch_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this._selected_branch!.branch_seq!!= null)
        this.branch_seq.setValue(this._selected_branch!.branch_seq);

        if (this._selected_branch!.branch_name! != null)
        this.branch_name.setValue(this._selected_branch!.branch_name);

        if (this._selected_branch!.branch_address! != null)
        this.branch_address.setValue(this._selected_branch!.branch_address);

        if (this._selected_branch!.branch_phone!!= null)
        this.branch_phone.setValue(this._selected_branch!.branch_phone);

        if (this._selected_branch!.branch_email!!= null)
        this.branch_email.setValue(this._selected_branch!.branch_email);
        
        if (this._selected_branch!.branch_website!!= null)
        this.branch_website.setValue(this._selected_branch!.branch_website);
        
        if (this._selected_branch!.branch_order!!= null)
        this.branch_order.setValue(this._selected_branch!.branch_order);
    }
  }

  getValue()
  {
    if (this.Form!= null )
    {
      
        if (this.branch_name.value!= null)
          this._selected_branch.branch_name = this.branch_name.value;


          if (this.branch_address.value!= null)
          this._selected_branch.branch_address = this.branch_address.value;



          if (this.branch_phone.value!= null)
          this._selected_branch.branch_phone = this.branch_phone.value;

          if (this.branch_email.value!= null)
          this._selected_branch.branch_email = this.branch_email.value;
          
          if (this.branch_website.value!= null)
          this._selected_branch.branch_website = this.branch_website.value;
          
          if (this.branch_order.value!= null)
          this._selected_branch.branch_order = this.branch_order.value;


       
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

    if (this._selected_branch.branch_seq!!= null)
    {
      this.branchService.update(this.Form.value).subscribe(
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
    }else if (this._selected_branch.branch_seq== null)
    {
      console.log('add');
      this.branchService.add(this.Form.value).subscribe(
        res => {
          console.log('res', res);

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
    this.branch_name.addAsyncValidators([validateBranchName(this.branchService, this.branch_name.value)]);

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
