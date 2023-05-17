import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';
import { month, months } from 'src/app/modules/shared/models/month';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageSanadKidService } from '../../pageservice/page-sanad-kid.service';

@Component({
  selector: 'app-sanad-kid-search-bar',
  templateUrl: './sanad-kid-search-bar.component.html',
  styleUrls: ['./sanad-kid-search-bar.component.scss']
})
export class SanadKidSearchBarComponent {

  @Input() Title:string = '';
  @Output() OnSelectItem : EventEmitter<any> = new EventEmitter<any>();

  selected_sanad_kid: sanad_kid;

  months:month[]=months ;

  incumbent_id_from: FormControl<number|null> ;
  incumbent_id_to:  FormControl<number|null> ;

  document_id_from: FormControl<number|null> ;
  document_id_to:  FormControl<number|null> ;

  

  sanad_month:  FormControl<number[]|null> ;
  incumbent_month:  FormControl<number[]|null> ;
  page_index:  FormControl<number|null> ;
  
  sanad_kid_list: sanad_kid[]= [];
  
  from_num_is_inserted: boolean= false;
  to_num_is_inserted: boolean= false;
  
  Form:FormGroup;
  
  darkTheme: boolean;
  
  constructor(
    private modalService: NgbModal,  
    private fb: FormBuilder,
    private PageSanadKidService:PageSanadKidService,
    public dialog: MatDialog,
    private SanadKidService: SanadKidService,
    @Inject(DOCUMENT) private _document: Document) {

      console.log(this.months);
      this.Form =this.fb.group({        
      'incumbent_id_from':this.incumbent_id_from = new  FormControl<number|null>(null) ,
      'incumbent_id_to':this.incumbent_id_to=new  FormControl<number|null> (null),
      'document_id_from':this.document_id_from = new  FormControl<number|null>(null) ,
      'document_id_to':this.document_id_to=new  FormControl<number|null> (null),
      'month_incumbent':this.sanad_month= new  FormControl<number[]|null> (null),
      'month_document':this.incumbent_month=new  FormControl<number[]|null> (null),
      'page_index':this.page_index=new  FormControl<number|null> (1),
      });
  
     
     }
  
  
  ngOnInit(): void {
    
  }
  
  PerformSearch()
  {
    this.sanad_kid_list=[];
    this.page_index.setValue(1);  
    this.RefreshList();
  }
  
  RefreshList()
  {    
    console.log('this.Form.value', this.Form.value);
    this.SanadKidService.search(this.Form.value).subscribe((res: any) =>{  
      console.log('res', res);
      this.sanad_kid_list=[...this.sanad_kid_list ,... res.value] ;
      console.log('this.sanad_kid_list', this.sanad_kid_list);
    });
  
  }
  
  
  SelectItemChange (selected_sanad_kid: sanad_kid)
  {
    this.selected_sanad_kid = selected_sanad_kid;
    this.PageSanadKidService.$sanad_kid.next(this.selected_sanad_kid);
    this.OnSelectItem.emit(this.selected_sanad_kid);
   

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

  
  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, { windowClass: 'sidepanel sidepanel-fade', size: 'side-40', backdropClass: 'light-blue-backdrop' }).result.then((Result) => {  

if (Result==1)
      {
        
      }
else 
{

}


    }).catch(() => {

    });
  }

}
