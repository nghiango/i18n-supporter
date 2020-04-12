import {Injectable} from '@angular/core';
import {Builder} from '../shared/buider';
import { JsonFlat } from 'src/app/models/json-flat';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor() { }

  public buildJsonFlats(resource: Object, path: string, level: number, jsonFlats: any[]) {
    const parentPath = path;
    const rootLevel = level;
    for (const key in resource) {
      path += key;
      if (this.isObject(resource[key])) {
        const jsonFlat = this.addJsonFlat(jsonFlats, key, path, parentPath, level, true);
        path = jsonFlat.path;
        this.buildJsonFlats(resource[key], path, ++level, jsonFlats);
      } else {
        this.addJsonFlat(jsonFlats, key, path, parentPath, level);
      }
      path = '';
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
    const newDictionary = {};
    Object.keys(dictionary).forEach(key => {
      const keyArr = key.split('.');
      this.buildNestedNode(keyArr, newDictionary, dictionary[key], 0);
    });
    return newDictionary;
  }

  public buildNestedNode(keyArr: string[], newDictionary: {}, value: any, index: number) {
    if (index === (keyArr.length - 1)) {
      newDictionary[keyArr[index]] = value;
      return;
    }
    if (!(keyArr[index] in newDictionary)) {
      newDictionary[keyArr[index]] = {};
    }
    this.buildNestedNode(keyArr, newDictionary[keyArr[index]], value, index + 1);
  }

  public replaceValueDictionary(originalDictionary: {}, newDictionary: {}) {
    Object.keys(newDictionary).forEach(key => {
      if (key in originalDictionary) {
        originalDictionary[key] = newDictionary[key];
      }
    });
    return originalDictionary;
  }

  public formatJsonString(nestedJsonContent: {})  {
    /*
    Task: Should add configuration for the format json
    */
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

  private addJsonFlat = (jsonFlats, name: string, path: string, parentPath: string, level: number, hasChildren = false): JsonFlat => {
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
        .build();
    jsonFlats.push(jsonFlat);
    return jsonFlat;
  }
}
