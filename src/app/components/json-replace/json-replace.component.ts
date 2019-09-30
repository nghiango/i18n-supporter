import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FileService} from '../../services/file.service';
import {FormControl} from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

class TextAreaFileContent {
  formControl: FormControl;
  isDisabled: boolean;
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
  constructor(
    private fileService: FileService
  ) { }

  ngOnInit() {}

  handleFileInput(files: FileList, textAreaContent: TextAreaFileContent) {
    this.fileToUpload = files.item(0);
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (typeof fileReader.result === 'string') {
        textAreaContent.formControl.setValue(fileReader.result);
        textAreaContent.isDisabled = true;
        console.log(JSON.parse(fileReader.result));
      }
    }
    fileReader.readAsText(this.fileToUpload);
  }
}
