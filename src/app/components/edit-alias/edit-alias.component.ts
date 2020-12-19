import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-alias',
  templateUrl: './edit-alias.component.html',
  styleUrls: ['./edit-alias.component.css']
})
export class EditAliasComponent {

  constructor(
    public dialogRef: MatDialogRef<EditAliasComponent>,
    @Inject(MAT_DIALOG_DATA) public alias: string
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

}
