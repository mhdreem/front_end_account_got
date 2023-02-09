import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { department } from 'src/app/modules/shared/models/department';
import { result } from 'src/app/modules/shared/models/result';
import { DepartmentService } from 'src/app/modules/shared/services/department.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateDepartmentName } from './Validators/validateDepartmentName';

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss']
})
export class DepartmentAddComponent implements OnInit {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_department:department= {};
  set selected_department(obj:department)
  {
    this._selected_department =  obj;
    this.setValue();
  }
  get  selected_department():department
  {
    return this._selected_department ;
  }

  Form: FormGroup;
  department_seq: FormControl<number | null>;
  department_name: FormControl<string | null>;
  department_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<DepartmentAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private formValidatorsService: FormValidationHelpersService,
    private departmentService: DepartmentService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_department = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'department_seq': this.department_seq = new FormControl<number | null>(null, []),
        'department_name': this.department_name = new FormControl<string | null>(null, [Validators.required]),
        'department_order': this.department_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_department!.department_seq!!= null)
        this.department_seq.setValue(this.selected_department!.department_seq);

        if (this.selected_department!.department_name! != null)
        this.department_name.setValue(this.selected_department!.department_name);

        if (this.selected_department!.department_order! != null)
        this.department_order.setValue(this.selected_department!.department_order);

        
    }
  }

  getValue()
  {
    if (this.Form!= null )
    {
      
        if (this.department_name.value!= null)
          this.selected_department.department_name = this.department_name.value;


          if (this.department_order.value!= null)
          this.selected_department.department_order = this.department_order.value;


       
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

    if (this.selected_department.department_seq!!= null)
    {
      this.departmentService.update(this.Form.value).subscribe(
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
    }else if (this.selected_department.department_seq== null)
    {
      this.departmentService.add(this.Form.value).subscribe(
        res => {
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
    this.department_name.addAsyncValidators([validateDepartmentName(this.departmentService, this.department_name.value)]);

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
