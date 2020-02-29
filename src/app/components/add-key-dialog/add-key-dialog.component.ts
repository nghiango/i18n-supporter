import { JsonService } from './../../services/json.service';
import { NewNode } from './../../models/new-node';
import { FormControl, Validators } from '@angular/forms';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FileDto} from '../../models/file-dto';
import {JsonNode} from '../../models/json-node';
import { Builder } from 'src/app/shared/buider';

@Component({
  selector: 'json-add-key-dialog',
  templateUrl: './add-key-dialog.component.html',
  styleUrls: ['./add-key-dialog.component.scss']
})
export class AddKeyDialogComponent implements OnInit {
  public node: JsonNode;
  public files: FileDto[];
  public nodeName = new FormControl();
  constructor(
    public dialogRef: MatDialogRef<AddKeyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Object,
    public jsonService: JsonService
  ) { }

  ngOnInit() {
    this.files = this.data['files'];
    this.node = this.data['node'];
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addKey() {
    const path = `${this.getCurrentPath(this.node)}.${this.nodeName.value}`;
    this.files.forEach(file => {
      file.jsonDictionary[path] = file.formControl.value;
    });
    const node = Builder(JsonNode)
                  .name(this.nodeName.value)
                  .children([])
                  .path(path)
                  .parentPath(this.node.path)
                  .formControl(new FormControl(this.nodeName.value, Validators.required))
                  .build();
    this.node.children.push(node);
    this.dialogRef.close();
  }

  private getCurrentPath(node: JsonNode): string {
    return node.path.substring(0, node.path.lastIndexOf('.'));
  }
}
