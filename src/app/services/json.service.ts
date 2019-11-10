import {Injectable} from '@angular/core';
import {JsonNode} from '../models/json-node';
import {FormControl, Validators} from '@angular/forms';
import {Builder} from '../shared/buider';

@Injectable()
export class JsonService {

  constructor() { }

  public buildJsonNodes(resource: Object, jsonNodes: JsonNode[], path: string) {
    const JsonNodeBuilder = Builder(JsonNode);
    const tempPath = path;
    const keys = Object.keys(resource);
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        if (typeof resource[keys[i]] !== 'string') {
          if (Object.keys(resource[keys[i]]).length > 0) {
            path += keys[i] + '.';
            const node = JsonNodeBuilder
              .name(keys[i])
              .children([])
              .path(path)
              .parentPath(tempPath)
              .formControl(new FormControl(keys[i], Validators.required))
              .build();
            node.children = this.buildJsonNodes(resource[keys[i]], [],  path);
            jsonNodes.push(node);
            path = tempPath;
          }
        } else {
          const finalPath = path + keys[i];
          jsonNodes.push({name: keys[i], children: null,
            path: finalPath, parentPath: tempPath,  formControl: new FormControl(keys[i], Validators.required)});
        }
      }
    }
    return jsonNodes;
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
    return JSON.stringify(nestedJsonContent, null, 4);
  }

  public mergeKeys(currentJsonDictionary: Object, newJsonDictionary: Object) {
    Object.keys(newJsonDictionary).forEach(key => {
      if (!(key in currentJsonDictionary)) {
        currentJsonDictionary[key] = '';
      }
    });
    return currentJsonDictionary;
  }
}
