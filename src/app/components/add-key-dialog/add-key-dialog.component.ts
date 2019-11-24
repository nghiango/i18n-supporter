import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'json-add-key-dialog',
  templateUrl: './add-key-dialog.component.html',
  styleUrls: ['./add-key-dialog.component.scss']
})
export class AddKeyDialogComponent implements OnInit {
  public files = ['en.json', 'de.json', 'fr.json'];
  constructor(
    public dialogRef: MatDialogRef<AddKeyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit() {
  }

  closeDialog() {

  }

  addKey() {

  }
}
