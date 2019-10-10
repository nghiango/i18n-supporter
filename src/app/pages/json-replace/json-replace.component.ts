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

  public firstFileContent = new TextAreaFileContent(new FormControl(), false);
  public secondFileContent = new TextAreaFileContent(new FormControl(), false);
  public resultContent = new TextAreaFileContent(new FormControl(), false);
  public originalFileContent = new TextAreaFileContent(new FormControl(), false);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  fileResult: boolean;
  constructor(
    private fileService: FileService
  ) { }

  ngOnInit() {}

  handleFileInput(event, textAreaContent: TextAreaFileContent) {
    this.fileToUpload = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (typeof fileReader.result === 'string') {
        this.parseToJson(textAreaContent, fileReader.result);
        textAreaContent.formControl.setValue(fileReader.result);
        textAreaContent.isDisabled = true;
      }
      event.target.value = '';
    };
    fileReader.readAsText(this.fileToUpload);
  }

  private parseToJson(textAreaContent: TextAreaFileContent, fileReaderResult) {
    try {
      if (fileReaderResult) {
        textAreaContent.jsonValue = JSON.parse(fileReaderResult);
      } else {
        textAreaContent.jsonValue = JSON.parse(textAreaContent.formControl.value);
      }
    } catch (e) {
      alert('Can\'t parse this file to Json');
      return;
    }
  }

  public replaceValue(originalFileContent: TextAreaFileContent, newFileContent: TextAreaFileContent) {
    this.originalFileContent.formControl.setValue(originalFileContent.formControl.value);
    if (isNullOrUndefined(originalFileContent.formControl.value)) {
      alert('Please add content for original File');
      return;
    } else {
      this.parseToJson(originalFileContent, null);
    }
    if (isNullOrUndefined(newFileContent.formControl.value)) {
      alert('Please add content for new File');
      return;
    } else {
      this.parseToJson(newFileContent, null);
    }
    const originalDictionary = {};
    this.buildDictionary(originalFileContent.jsonValue, '', originalDictionary);
    const newDictionary = {};
    this.buildDictionary(newFileContent.jsonValue, '', newDictionary);
    const replacedDictionary = this.replaceValueDictionary(originalDictionary, newDictionary);
    const nestedJsonContent = this.buildJson(replacedDictionary);
    this.resultContent.formControl.setValue(JSON.stringify(nestedJsonContent, null, 4));
  }

  private buildDictionary(jsonData, prefix, jsonValueMap) {
    const temp = prefix;
    const jsonDataKeys = Object.keys(jsonData);
    for (let i = 0; i < jsonDataKeys.length; i ++) {
      if (typeof jsonData !== 'string') {
        prefix += jsonDataKeys[i] + '.';
        this.buildDictionary(jsonData[jsonDataKeys[i]], prefix, jsonValueMap);
        prefix = temp;
      } else {
        const newPrefix = prefix.substr(0, prefix.length - 1);
        jsonValueMap[newPrefix] = jsonData;
        break;
      }
    }
  }

  private replaceValueDictionary(originalDictionary: {}, newDictionary: {}) {
    Object.keys(newDictionary).forEach(key => {
      if (key in originalDictionary) {
        originalDictionary[key] = newDictionary[key];
      }
    });
    return originalDictionary;
  }

  private buildJson(dictionary: {}) {
    const newDictionary = {};
    Object.keys(dictionary).forEach(key => {
      const keyArr = key.split('.');
      this.buildNestedNode(keyArr, newDictionary, dictionary[key], 0);
    });
    return newDictionary;
  }

  private buildNestedNode(keyArr: string[], newDictionary: {}, value: any, index: number) {
    if (index === (keyArr.length - 1)) {
      newDictionary[keyArr[index]] = value;
      return;
    }
    if (!(keyArr[index] in newDictionary)) {
      newDictionary[keyArr[index]] = {};
    }
    this.buildNestedNode(keyArr, newDictionary[keyArr[index]], value, index + 1);
  }
}
