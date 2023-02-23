import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';
import { PageSanadKidService } from '../../pageservice/page-sanad-kid.service';

@Component({
  selector: 'app-sanad-kid-search-bar',
  templateUrl: './sanad-kid-search-bar.component.html',
  styleUrls: ['./sanad-kid-search-bar.component.scss']
})
export class SanadKidSearchBarComponent {

Selected_Sanad: sanad_kid;

PageIndex: number = 1;

from_number: FormControl<number|null> ;
to_number:  FormControl<number|null> ;
sanad_month:  FormControl<number|null> ;
incumbent_month:  FormControl<number|null> ;

sanad_list: sanad_kid[]= [];

from_num_is_inserted: boolean= false;
to_num_is_inserted: boolean= false;

Form:FormGroup;

darkTheme: boolean;

constructor(
  private fb: FormBuilder,
  private pageService:PageSanadKidService,
  public dialog: MatDialog,
  private sanadKidService: SanadKidService,
  @Inject(DOCUMENT) private _document: Document) {
    this.PageIndex =1;
    this.Form =this.fb.group({
    'from_number':this.from_number = new  FormControl<number|null>(null) ,
    'to_number':this.to_number=new  FormControl<number|null> (null),
    'sanad_month':this.sanad_month=new  FormControl<number|null> (null),
    'incumbent_month':this.incumbent_month=new  FormControl<number|null> (null),
    });

    // this.pageService.Subject_Selected_ViewTBLSamelEmployeeSearch.subscribe(
    //   data=>
    //   {
    //     this.RefreshList();
    //   }
    // )

   }


ngOnInit(): void {
  
}

OnFromNumberChange(){
  this.from_num_is_inserted= true;
  this.numberChange();
}

OnToNumberChange(){
  this.to_num_is_inserted= true;
  this.numberChange();
}

numberChange(){
  if (this.from_num_is_inserted && this.to_num_is_inserted)
    this.RefreshList();
}

onKidMonthChange(){
  this.RefreshList();
}

onIncumbentMonthChange(){
  this.RefreshList();
}

SelectItemChange (Selected_Sanad: sanad_kid)
{
  this.Selected_Sanad = Selected_Sanad;
  this.pageService.$sanad_kid.next(this.Selected_Sanad);
}





RefreshList()
{    
  this.sanadKidService.search(this.Form.value).subscribe((res: any) =>{
    this.sanad_list= res;
  });

}

onScroll() {
  // console.log(this.PageIndex);
  // this.PageIndex = this.PageIndex + 1;
  // console.log(this.PageIndex);
  // this.RefreshList();
}

public ngOnDestroy (): void {
 
}

focusNext(id: string) {
  let element = this._document.getElementById(id);
  if (element) {
    element.focus();
  }
}
}
