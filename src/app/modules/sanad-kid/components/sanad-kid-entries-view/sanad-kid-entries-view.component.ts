import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';

@Component({
  selector: 'app-sanad-kid-entries-view',
  templateUrl: './sanad-kid-entries-view.component.html',
  styleUrls: ['./sanad-kid-entries-view.component.scss']
})
export class SanadKidEntriesViewComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: sanad_kid,
  private dialogRef: MatDialogRef<SanadKidEntriesViewComponent>){

  }
}
