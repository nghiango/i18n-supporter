import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FileDto} from '../../models/file-dto';
import {JsonNode} from '../../models/json-node';

@Component({
  selector: 'json-add-key-dialog',
  templateUrl: './add-key-dialog.component.html',
  styleUrls: ['./add-key-dialog.component.scss']
})
export class AddKeyDialogComponent implements OnInit {
  public node: JsonNode;
  constructor(
    public dialogRef: MatDialogRef<AddKeyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public files: FileDto[]
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(this.node);
  }

  addKey() {

  }
}
