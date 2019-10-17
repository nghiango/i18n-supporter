import { Injectable } from '@angular/core';
import {JsonNode} from '../models/json-node';

@Injectable()
export class JsonService {

  constructor() { }

  public buildJsonNodes(resource: Object, jsonNodes: JsonNode[], path: string) {
    const tempPath = path;
    const keys = Object.keys(resource);
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        if (typeof resource[keys[i]] !== 'string') {
          if (Object.keys(resource[keys[i]]).length > 0) {
            path += keys[i] + '.';
            jsonNodes.push({name: keys[i], children: this.buildJsonNodes(resource[keys[i]], [],  path)});
            path = tempPath;
          }
        } else {
          const finalPath = path + keys[i];
          jsonNodes.push({name: keys[i], children: null, valueDic: {path: finalPath, value: resource[keys[i]]}});
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

  private buildTreeData(resource: Object, treeData: JsonNode[]) {
    const keys = Object.keys(resource);
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        if (typeof resource[keys[i]] !== 'string') {
          if (Object.keys(resource[keys[i]]).length > 0) {
            treeData.push({name: keys[i], children: this.buildTreeData(resource[keys[i]], [])});
          }
        } else {
          treeData.push({name: keys[i]});
          break;
        }
      }
    }
    return treeData;
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
}
