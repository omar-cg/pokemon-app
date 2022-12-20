import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warnings-dialog',
  templateUrl: './warnings-dialog.component.html',
  styleUrls: ['./warnings-dialog.component.scss']
})
export class WarningsDialogComponent implements OnInit {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<WarningsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.message = this.data.message;
  }
}
