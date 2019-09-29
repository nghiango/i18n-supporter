import { Component, OnInit } from '@angular/core';
import {FileService} from '../../services/file.service';
// @ts-ignore
import SampleJson from '../../../assets/jsonFiles/test.json';
@Component({
  selector: 'json-json-replace',
  templateUrl: './json-replace.component.html',
  styleUrls: ['./json-replace.component.scss']
})
export class JsonReplaceComponent implements OnInit {
  private fileToUpload: File = null;

  constructor(
    private fileService: FileService
  ) { }

  ngOnInit() {
    // console.log('Class: JsonReplaceComponent, Line 17: '
    // , SampleJson);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileService.readJsonFile().subscribe(value => console.log('Class: JsonReplaceComponent, Line 21: '
    , value));
    console.log('Class: JsonReplaceComponent, Line 18: ');
  }
}
