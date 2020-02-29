import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FileService} from '../../services/file.service';
import {FormControl} from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {isNullOrUndefined} from 'util';
import {JsonService} from '../../services/json.service';

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
  private file: File = null;

  public firstFileContent = new TextAreaFileContent(new FormControl(), false);
  public secondFileContent = new TextAreaFileContent(new FormControl(), false);
  public resultContent = new TextAreaFileContent(new FormControl(), false);
  public originalFileContent = new TextAreaFileContent(new FormControl(), false);

  @ViewChild('autosize', { static: true }) autosize: CdkTextareaAutosize;
  fileResult: boolean;
  constructor(
    private fileService: FileService,
    private jsonService: JsonService
  ) { }

  ngOnInit() {}

  handleFileInput(event, textAreaContent: TextAreaFileContent) {
    this.file = event.target.files[0];
    this.fileService.readContentOfFile(this.file).toPromise().then(content => {
      textAreaContent.formControl.setValue(content);
      event.target.value = '';
    });
  }

  public replaceValue(originalFileContent: TextAreaFileContent, newFileContent: TextAreaFileContent) {
    this.originalFileContent.formControl.setValue(originalFileContent.formControl.value);
    if (isNullOrUndefined(originalFileContent.formControl.value)) {
      alert('Please add content for original File');
      return;
    } else {
      originalFileContent.jsonValue = this.jsonService.parseToJson(originalFileContent.formControl.value);
    }
    if (isNullOrUndefined(newFileContent.formControl.value)) {
      alert('Please add content for new File');
      return;
    } else {
      newFileContent.jsonValue = this.jsonService.parseToJson(newFileContent.formControl.value);
    }
    const originalDictionary = this.jsonService.buildDictionary(originalFileContent.jsonValue, '', {});
    const newDictionary = this.jsonService.buildDictionary(newFileContent.jsonValue, '', {});
    const replacedDictionary = this.jsonService.replaceValueDictionary(originalDictionary, newDictionary);
    const nestedJsonContent = this.jsonService.buildJson(replacedDictionary);
    this.resultContent.formControl.setValue(this.jsonService.formatJsonString(nestedJsonContent));
  }
}
