import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { beneficiary_type } from 'src/app/modules/shared/models/beneficiary-type';
import { result } from 'src/app/modules/shared/models/result';
import { BeneficiaryTypeService } from 'src/app/modules/shared/services/beneficiary-type.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateBeneficiaryTypeCode } from './Validators/validateBeneficiaryTypeCode';
import { validateBeneficiaryTypeName } from './Validators/validateBeneficiaryTypeName';


@Component({
  selector: 'app-beneficiary-type-edit',
  templateUrl: './beneficiary-type-edit.component.html',
  styleUrls: ['./beneficiary-type-edit.component.scss']
})
export class BeneficiaryTypeEditComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_beneficiaryType:beneficiary_type= {};
  set selected_beneficiaryType(obj:beneficiary_type)
  {
    this._selected_beneficiaryType =  obj;
    this.setValue();
  }
  get  selected_beneficiaryType():beneficiary_type
  {
    return this._selected_beneficiaryType ;
  }

  Form: FormGroup;
  beneficiary_type_seq: FormControl<number | null>;
  beneficiary_type_name: FormControl<string | null>;
  beneficiary_type_code: FormControl<string | null>;
  beneficiary_type_note: FormControl<string | null>;
  classification_fk: FormControl<number | null>;
  // beneficiaryType_order: FormControl<number | null>;

  List_beneficiary_type: beneficiary_type[] = [];
    List_beneficiary_type_Filter: Observable<beneficiary_type[]> = of([]);
  
    LoadingFinish : boolean;

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<BeneficiaryTypeEditComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private beneficiaryTypeService: BeneficiaryTypeService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();
     this.LoadData();
     if (this.data != null && this.data.obj != null )     
      this.selected_beneficiaryType = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'beneficiary_type_seq': this.beneficiary_type_seq = new FormControl<number | null>(null, []),
        'beneficiary_type_name': this.beneficiary_type_name = new FormControl<string | null>(null, [Validators.required]),
        'beneficiary_type_code': this.beneficiary_type_code = new FormControl<string | null>(null, [Validators.required]),
        'beneficiary_type_note': this.beneficiary_type_note = new FormControl<string | null>(null, [Validators.required]),
        'classification_fk': this.classification_fk = new FormControl<number | null>(null, [Validators.required]),
        // 'beneficiaryType_order': this.beneficiaryType_order = new FormControl<number | null>(null, []),
      },
    );
  }

  LoadBeneficiary_type(): Observable<beneficiary_type[]> {
    if (this.beneficiaryTypeService.list == null ||
      this.beneficiaryTypeService.List_beneficiary_type == undefined ||
      this.beneficiaryTypeService.List_beneficiary_type.length == 0)
      return this.beneficiaryTypeService.list();
    return of(this.beneficiaryTypeService.List_beneficiary_type);
  }

  LoadData() {
    this.LoadingFinish = false;
  
      forkJoin(
        [this.LoadBeneficiary_type(),

        ]
        ).subscribe(res => {

          this.beneficiaryTypeService.List_beneficiary_type = res[0];
      this.beneficiaryTypeService.List_beneficiary_type_BehaviorSubject.next(res[0]);
      this.List_beneficiary_type = res[0];
      this.List_beneficiary_type_Filter = of(res[0]);
      this.LoadingFinish = true;


      this.List_beneficiary_type_Filter = this.Form.controls['classification_fk'].valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filteredBeneficiary_type(value) : this.List_beneficiary_type.slice())
          );
        })
      }

      private _filteredBeneficiary_type(value: string): beneficiary_type[] {
        if (value) {
          const filterValue = value;
          return this.List_beneficiary_type.filter(obj => obj.beneficiary_type_name!.includes(filterValue));
    
        }
        return this.List_beneficiary_type.slice();
      }

      public displayBeneficiaryTypeProperty(value: string): string {
        if (value && this.List_beneficiary_type) {
          let documentType: any = this.List_beneficiary_type.find(crs => crs.beneficiary_type_seq!.toString() == value);
          if (documentType)
            return documentType.beneficiary_type_name;
        }
        return '';
      }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_beneficiaryType!.beneficiary_type_seq!!= null)
        this.beneficiary_type_seq.setValue(this.selected_beneficiaryType!.beneficiary_type_seq);

        if (this.selected_beneficiaryType!.beneficiary_type_name! != null)
        this.beneficiary_type_name.setValue(this.selected_beneficiaryType!.beneficiary_type_name);
        
        if (this.selected_beneficiaryType!.beneficiary_type_code! != null)
        this.beneficiary_type_code.setValue(this.selected_beneficiaryType!.beneficiary_type_code);
        
        if (this.selected_beneficiaryType!.beneficiary_type_note! != null)
        this.beneficiary_type_note.setValue(this.selected_beneficiaryType!.beneficiary_type_note);
        
        if (this.selected_beneficiaryType!.classification_fk! != null)
        this.classification_fk.setValue(this.selected_beneficiaryType!.classification_fk);

        // if (this.selected_beneficiaryType!.beneficiaryType_order!!= null)
        // this.beneficiaryType_order.setValue(this.selected_beneficiaryType!.beneficiaryType_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.beneficiary_type_name.value!= null)
          this.selected_beneficiaryType.beneficiary_type_name = this.beneficiary_type_name.value;

          if (this.beneficiary_type_code.value!= null)
          this.selected_beneficiaryType.beneficiary_type_code = this.beneficiary_type_code.value;

          if (this.beneficiary_type_note.value!= null)
          this.selected_beneficiaryType.beneficiary_type_note = this.beneficiary_type_note.value;

          if (this.classification_fk.value!= null)
          this.selected_beneficiaryType.classification_fk = this.classification_fk.value;

          // if (this.beneficiaryType_order.value!= null && (this.beneficiaryType_order.value+ "") != "")
          // this.selected_beneficiaryType.beneficiaryType_order = this.beneficiaryType_order.value;
       
        }
  }

 
  ResetForm()
  {
    this.Form.reset();
    this.focusNext('beneficiaryType_name')
  }


  save()
  {
    if (this.Form.valid == false)
    {
      //print error using snaker
    }
    this.getValue();

    if (this.selected_beneficiaryType.beneficiary_type_seq!!= null)
    {
      this.beneficiaryTypeService.update(this.Form.value).subscribe(
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
    }else if (this.selected_beneficiaryType.beneficiary_type_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.beneficiaryTypeService.add(this.Form.value).subscribe(
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
    // console.log('this.Form.errors', this.Form.errors);
    this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.beneficiary_type_name.addAsyncValidators([validateBeneficiaryTypeName(this.beneficiaryTypeService, this.beneficiary_type_name.value)]);
    this.beneficiary_type_code.addAsyncValidators([validateBeneficiaryTypeCode(this.beneficiaryTypeService, this.beneficiary_type_code.value)]);

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
