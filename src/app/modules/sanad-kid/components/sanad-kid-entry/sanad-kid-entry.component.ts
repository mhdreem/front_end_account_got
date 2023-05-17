import { Component, OnDestroy, OnInit, AfterViewInit, OnChanges, ViewChild, Input, SimpleChanges } from "@angular/core";
import { Subscription, Observable, of, forkJoin } from "rxjs";
import { result } from "src/app/modules/shared/models/result";
import { sanad_kid } from "src/app/modules/shared/models/sanad-kid";
import { SanadKidEditComponent } from "../sanad-kid-edit/sanad-kid-edit.component";
import { PageSanadKidService } from "../../pageservice/page-sanad-kid.service";
import { SanadKidService } from "src/app/modules/shared/services/sanad-kid.service";

@Component({
  selector: 'app-sanad-kid-entry',
  templateUrl: './sanad-kid-entry.component.html',
  styleUrls: ['./sanad-kid-entry.component.scss'],
})
export class SanadKidEntryComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {
  @ViewChild(SanadKidEditComponent) SanadKid: SanadKidEditComponent;

  public defaultNavActiveId: number | undefined = 1;
  _sanad_kid: sanad_kid;
  get sanad_kid(): sanad_kid {
    return this._sanad_kid;
  }

  @Input() set sanad_kid(obj: sanad_kid) {
    this._sanad_kid = {};
    this._sanad_kid = obj;

    if (this._sanad_kid == null)
      this._sanad_kid = {};

    if (this._sanad_kid.sanad_kid_attachements == null ||
      this._sanad_kid.sanad_kid_attachements.length == 0)
      this._sanad_kid.sanad_kid_attachements = [];

    if (this._sanad_kid == null ||
      this._sanad_kid.sanad_kid_details == null ||
      this._sanad_kid.sanad_kid_details.length == 0)
      this._sanad_kid.sanad_kid_details = [];

    if (this._sanad_kid == null ||
      this._sanad_kid.sanad_kid_entries == null ||
      this._sanad_kid.sanad_kid_entries.length == 0)
      this._sanad_kid.sanad_kid_entries = [];



    if (this._sanad_kid != null &&
      this._sanad_kid.sanad_kid_seq != null) {
      this.operation_code_fk = this._sanad_kid.sanad_kid_seq;
      this.seq = this._sanad_kid.sanad_kid_seq;
    }





  }




  operation_code_fk?: number = undefined;
  operation_type_fk?: number = 1;
  seq?: number = undefined;


  _Subscription: Subscription[] = [];

  constructor(
    private PageSanadKidService: PageSanadKidService,
    private SanadKidService: SanadKidService,
  ) {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
   
  }

  ngOnDestroy(): void {

    this._Subscription.forEach(Sub => {
      if (Sub != null) Sub.unsubscribe();
    });
  }


  new_record()
  {
    
    this.PageSanadKidService.sanad_kid ={
      sanad_kid_details :[],
      sanad_kid_attachements:[]
    };    
    this.PageSanadKidService.$sanad_kid.next(this.PageSanadKidService.sanad_kid); 
    this.sanad_kid = this.PageSanadKidService.sanad_kid;
  }

  public Load_sanad_kid(sanad_kid_seq: number | number | undefined): Observable<result> {

    if (sanad_kid_seq == null ||
      sanad_kid_seq == undefined ||
      sanad_kid_seq == 0) {
      this.sanad_kid = {};
      this.sanad_kid.sanad_kid_details = [];
      this.sanad_kid.sanad_kid_attachements = [];


      let result: result = {
        value: this.sanad_kid,
        error: '',
        success: true
      }
      return of(result);
    }

    return this.SanadKidService.getBySeq(sanad_kid_seq);
  }





  loadData() {


    let sanad_kid_seq: number | undefined | null = this.PageSanadKidService.sanad_kid.sanad_kid_seq;

    this._Subscription.push
      (
        forkJoin(
          this.Load_sanad_kid(sanad_kid_seq),

        ).subscribe(
          res => {
            if (res != null && res[0].value != null) {
              this.sanad_kid = res[0].value;
            }

          }
        )
      );
  }




  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  save_as_draft() {

    if (this.SanadKid != null) {
      this.SanadKid.save_as_draft();
    }

  }


  save() {

    if (this.SanadKid != null) {
      this.SanadKid.save();
    }


  }


  OnSelectItem(sanad_kid: sanad_kid) {
    this.SanadKid= JSON.parse(JSON.stringify(sanad_kid));

  }





  re_load_data(sanad_kid: sanad_kid) {

    if (sanad_kid == null)
      return;
    if (sanad_kid.sanad_kid_seq == null)
      return;





    if (sanad_kid != null) {

      this.operation_code_fk = this.sanad_kid.sanad_kid_seq;
      this.seq = this.sanad_kid.sanad_kid_seq;

    }






  }



}
