import { Component , Inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { result } from '../../models/result';
import { account_centerService } from '../../services/account-center.service';

@Component({
  selector: 'app-import-from-excel',
  templateUrl: './import-from-excel.component.html',
  styleUrls: ['./import-from-excel.component.scss']
})
export class ImportFromExcelComponent {

  selectedFile:any;
  Form: FormGroup;
  IFormFile: FormControl<any | null>;

  fileIsUploaded: boolean= false;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private dialogRef: MatDialogRef<ImportFromExcelComponent>,
  private frmBuilder:FormBuilder,
  private accountCenterService: account_centerService,
  private _snaker: MatSnackBar){
    this.Form = this.frmBuilder.group(
      {
        'IFormFile': this.IFormFile = new FormControl<any | null>(null, []),
      }
    );
    
  }

  chooseFile(event: any) {
    const files = event.target.files;
    this.selectedFile = files[0];
    this.fileIsUploaded= true;
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.selectedFile);
  }

  
    
}
