import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FileService} from '../../services/file.service';
import {FormControl} from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {isNullOrUndefined} from 'util';

class TextAreaFileContent {
  formControl: FormControl;
  isDisabled: boolean;
  jsonValue: Object;
  constructor(formControl: FormControl, isDisabled: boolean) {
    this.formControl = formControl;
    this.isDisabled = isDisabled;
}
}
@Component({
  selector: 'json-json-replace',
  templateUrl: './json-replace.component.html',
  styleUrls: ['./json-replace.component.scss']
})
export class JsonReplaceComponent implements OnInit {
  private fileToUpload: File = null;

  public originalFileContent = new TextAreaFileContent(new FormControl(), false);
  public newFileContent = new TextAreaFileContent(new FormControl(), false);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  fileResult: boolean;
  constructor(
    private fileService: FileService
  ) { }

  ngOnInit() {}

  handleFileInput(files: FileList, textAreaContent: TextAreaFileContent) {
    this.fileToUpload = files.item(0);
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (typeof fileReader.result === 'string') {
        try {
          textAreaContent.jsonValue = JSON.parse(fileReader.result);
        } catch (e) {
          alert('Can\'t parse this file to Json');
          return;
        }
        textAreaContent.formControl.setValue(fileReader.result);
        textAreaContent.isDisabled = true;
      }
    }
    fileReader.readAsText(this.fileToUpload);
  }

  replaceValue() {
    if (isNullOrUndefined(this.originalFileContent.formControl.value)) {
      alert('Please add content for original File');
      return;
    }
    if (isNullOrUndefined(this.newFileContent.formControl.value)) {
      alert('Please add content for new File');
      return;
    }
    // TODO: After replace value should build a file and show button download

  }
}
