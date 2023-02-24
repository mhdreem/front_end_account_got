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


from_number: FormControl<number|null> ;
to_number:  FormControl<number|null> ;
sanad_month:  FormControl<number|null> ;
incumbent_month:  FormControl<number|null> ;
page_index:  FormControl<number|null> ;

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
    this.Form =this.fb.group({
      
    'incumbent_id_from':this.from_number = new  FormControl<number|null>(null) ,
    'incumbent_id_to':this.to_number=new  FormControl<number|null> (null),
    'month_incumbent':this.sanad_month= new  FormControl<number|null> (null),
    'month_document':this.incumbent_month=new  FormControl<number|null> (null),
    'page_index':this.page_index=new  FormControl<number|null> (1),
    });

   
   }


ngOnInit(): void {
  
}

PerformSearch()
{
  this.sanad_list=[];
  this.page_index.setValue(1);  
  this.RefreshList();
}

RefreshList()
{    
  this.sanadKidService.search(this.Form.value).subscribe((res: any) =>{  
    console.log('res', res);
    this.sanad_list=[this.sanad_list ,... res.value] ;
  });

}


SelectItemChange (Selected_Sanad: sanad_kid)
{
  this.Selected_Sanad = Selected_Sanad;
  this.pageService.$sanad_kid.next(this.Selected_Sanad);
}






onScroll() {
   this.page_index.setValue(this.page_index.value! + 1);
   this.Form.controls['page_index'] .setValue( this.page_index);
   this.RefreshList();
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
