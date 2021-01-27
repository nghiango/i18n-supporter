import {quoteWrapper} from './util';
import {FileOptions} from './../models/file-options';
import {Injectable} from '@angular/core';
import {Builder} from '../shared/buider';
import {JsonFlat} from 'src/app/models/json-flat';
import {FormControl} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor() { }

  /**
   This function uses to build a list of JsonFlat object that serve the cdk-virtual-scroll-viewport
   @param resource It is a nested JSON object
   @param path The inital path should be ''
   @param level The inital level should be 1
   @param jsonFlats The inital jsonFlats should be []
   @param expandedAll Put true when you want to expand all nodes.
   @returns an array of JsonFlat object
  */
  public buildJsonFlats(resource: Object, path: string, level: number, jsonFlats: any[], expandedAll: boolean = false): JsonFlat[] {
    const parentPath = path;
    const rootLevel = level;
    for (const key in resource) {
      path += key;
      if (this.isObject(resource[key])) {
        const jsonFlat = this.addJsonFlat(jsonFlats, key, path, parentPath, level, true, expandedAll);
        path = jsonFlat.path;
        this.buildJsonFlats(resource[key], path, ++level, jsonFlats, expandedAll);
      } else {
        this.addJsonFlat(jsonFlats, key, path, parentPath, level, false, expandedAll);
      }
      path = parentPath;
      level = rootLevel;
    }
    return jsonFlats;
  }

  public isObject(object) {
    return object && typeof object === 'object';
  }

  public buildDictionary(resource: Object, path: string, jsonDictionary: Object) {
    const temp = path;
    const jsonDataKeys = Object.keys(resource);
    for (let i = 0; i < jsonDataKeys.length; i ++) {
      if (typeof resource !== 'string') {
        path += jsonDataKeys[i] + '.';
        this.buildDictionary(resource[jsonDataKeys[i]], path, jsonDictionary);
        path = temp;
      } else {
        const newPrefix = path.substr(0, path.length - 1);
        jsonDictionary[newPrefix] = resource;
        break;
      }
    }
    return jsonDictionary;
  }

  public parseToJson(fileReaderResult) {
    try {
      if (fileReaderResult) {
        return JSON.parse(fileReaderResult);
      }
    } catch (e) {
      alert('Can\'t parse this file to Json');
      return;
    }
  }

  public buildJson(dictionary: {}) {
    const jsonObject = {};
    Object.keys(dictionary).forEach(key => {
      const keyArr = key.split('.');
      this.buildNestedNode(keyArr, jsonObject, dictionary[key], 0);
    });
    return jsonObject;
  }

  public buildFlattenJsonString(jsonDictionary: Object, fileOptions: FileOptions): string {
    const reducer =
    (jsonString, currentKey) =>
    jsonString +=
    `${quoteWrapper(fileOptions.doubleQuote, currentKey)}: ${quoteWrapper(fileOptions.doubleQuote, jsonDictionary[currentKey])},\n`;
    return `{\n${Object.keys(jsonDictionary).reduce(reducer, '')}}`;
  }

  /*
  Build nested node base on object attribute
  newDoc['component'] = {}
  newDic['component']['gender'] = 'value'
  */
  public buildNestedNode(keyArr: string[], jsonObject: {}, value: any, index: number) {
    if (index === (keyArr.length - 1)) {
      jsonObject[keyArr[index]] = value;
      return;
    }
    if (!(keyArr[index] in jsonObject)) {
      jsonObject[keyArr[index]] = {};
    }
    this.buildNestedNode(keyArr, jsonObject[keyArr[index]], value, index + 1);
  }

  public replaceValueDictionary(originalDictionary: {}, newDictionary: {}) {
    Object.keys(newDictionary).forEach(key => {
      if (key in originalDictionary) {
        originalDictionary[key] = newDictionary[key];
      }
    });
    return originalDictionary;
  }

  public formatJsonString(nestedJsonContent: {}, fileOptions: FileOptions = null)  {

    if(fileOptions && !fileOptions.tab) {
      return JSON.stringify(nestedJsonContent, null, fileOptions.indentWidth);
    }
    return JSON.stringify(nestedJsonContent, null, '\t');
  }

  public mergeKeys(currentJsonDictionary: Object, newJsonDictionary: Object) {
    Object.keys(newJsonDictionary).forEach(key => {
      if (!(key in currentJsonDictionary)) {
        currentJsonDictionary[key] = '';
      }
    });
    return currentJsonDictionary;
  }

  public getCombinePath(name: string, path: string): string {
    const pathArr = path.split('.');
    if (pathArr[pathArr.length - 1] !== '') {
      return path.substring(0, path.lastIndexOf('.')) + `.${name}`;
    }
    let newPath = '';
    for (let i = 0; i < (pathArr.length - 1); i++) {
      if (i === (pathArr.length - 2)) {
        newPath += name + '.';
        return newPath;
      }
      newPath += pathArr[i] + '.';
    }
  }

  private addJsonFlat = (jsonFlats, name: string, path: string,
                         parentPath: string, level: number,
                         hasChildren = false, isExpanded: boolean = false): JsonFlat => {
    if (hasChildren) {
      path += '.';
    }
    const jsonFlat =
      Builder(JsonFlat)
        .name(name)
        .path(path)
        .parentPath(parentPath)
        .level(level)
        .hasChildren(hasChildren)
        .isExpanded(isExpanded)
        .formControl(new FormControl())
        .build();
    jsonFlats.push(jsonFlat);
    return jsonFlat;
  }

  public prepareDataForSearching(jsonDic: Object) {
    const dataForSearchValue: Map<string, string[]> = new Map<string, string[]>();
    const dataForSearchKey: string[] = [];
    Object.keys(jsonDic).forEach(key => {
      dataForSearchKey.push(key);
      const value = jsonDic[key].toLowerCase();
      if (dataForSearchValue[value]) {
        dataForSearchValue[value] = [...dataForSearchValue[value], key];
      } else {
        dataForSearchValue[value] = [key];
      }
    });
    return {
      dataForSearchValue: dataForSearchValue,
      dataForSearchKey: dataForSearchKey
    };
  }
}
