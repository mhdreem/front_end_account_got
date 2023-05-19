import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { sanad_kid } from '../../shared/models/sanad-kid';
import * as moment from 'moment';
import { sanad_kid_attachement } from '../../shared/models/sanad_kid_attachement';
import { sanad_kid_detail } from '../../shared/models/sanad_kid_detail';
import { SanadKidService } from '../../shared/services/sanad-kid.service';

@Component({
  selector: 'app-automatic-sanad-kid',
  templateUrl: './automatic-sanad-kid.component.html',
  styleUrls: ['./automatic-sanad-kid.component.css']
})
export class AutomaticSanadKidComponent implements OnInit, OnChanges {


  _operation_code_fk : number|undefined;

  get operation_code_fk() : number|undefined {
    return this._operation_code_fk;
  }

  @Input() set operation_code_fk(obj : number|undefined) {
    this._operation_code_fk = obj;
  }



  _operation_type_fk: number|undefined;

  get operation_type_fk(): number|undefined {
    return this._operation_type_fk;
  }

  @Input() set operation_type_fk(obj: number|undefined) {
    this._operation_type_fk = obj;
  }


  _sanad_kid: sanad_kid;

  get sanad_kid(): sanad_kid {
    return this._sanad_kid;
  }

  @Input() set sanad_kid(obj: sanad_kid) {
    this._sanad_kid = obj;

    if (this._sanad_kid == null)
      this._sanad_kid = {};

    if (this._sanad_kid.sanad_kid_attachements == null ||
      this._sanad_kid.sanad_kid_attachements.length == 0)
      this._sanad_kid.sanad_kid_attachements = [];

    if (
      this._sanad_kid.sanad_kid_details == null ||
      this._sanad_kid.sanad_kid_details.length == 0)
      this._sanad_kid.sanad_kid_details = [];

    if (
      this._sanad_kid.sanad_kid_entries == null ||
      this._sanad_kid.sanad_kid_entries.length == 0)
      this._sanad_kid.sanad_kid_entries = [];
  }


  constructor(
    private SanadKidService: SanadKidService
  ) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['operation_type_fk'] != null) {
      this.operation_type_fk = changes['operation_type_fk'].currentValue;
    }

    if (changes['operation_code_fk'] != null) {
      this.operation_code_fk = changes['operation_code_fk'].currentValue;
    }

    this.load_data();
  }


  public load_data() {
    if (
      this.operation_code_fk != null &&
      this.operation_type_fk != null &&
      this.operation_code_fk > 0 &&
      this.operation_type_fk > 0) {
      this.SanadKidService.getByOperationCode(this.operation_code_fk, this.operation_type_fk).subscribe(
        res => {
          if (res != null && res.value != null)
            this.sanad_kid = res.value;
        }
      )
    }
  }

  getValue(property_name: string): string {
    if (this.sanad_kid != null && property_name != null && this.sanad_kid[property_name as keyof typeof this.sanad_kid] != null) {
      var temp = this.sanad_kid[property_name as keyof typeof this.sanad_kid];
      if (temp != null && typeof temp === "number") {
        return temp.toString();
      } else if (temp != null && typeof temp === "string") {
        return temp.toString();
      } else if (temp != null && typeof temp === "object" && property_name.includes('date')) {
        if (moment(temp.toString()).isValid())
          return moment(temp.toString()).format('DD/MM/YYYY');
      }else if (temp!= null) return temp.toString();


    }

    return '';

  }

  getByObject(obj: any, property_name: string): string {
    if (obj != null && property_name != null && obj[property_name as any] != null) {
      var temp = obj[property_name as any];
      if (temp != null && typeof temp === "number") {
        return temp.toString();
      } else if (temp != null && typeof temp === "string") {
        return temp.toString();
      } else if (temp != null && typeof temp === "object" && property_name.includes('date')) {
        if (moment(temp.toString()).isValid())
          return moment(temp.toString()).format('DD/MM/YYYY');
      }

    }

    return '';

  }

  sanad_kid_attachements(): sanad_kid_attachement[] {
    if (this.sanad_kid != null && this.sanad_kid.sanad_kid_attachements != null)
      return this.sanad_kid.sanad_kid_attachements
    return [];

  }

  sanad_kid_details(): sanad_kid_detail[] {
    if (this.sanad_kid != null && this.sanad_kid.sanad_kid_details != null)
      return this.sanad_kid.sanad_kid_details
    return [];

  }

}
