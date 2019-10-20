import {Component, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {JsonNode} from '../../models/json-node';
import {JsonService} from '../../services/json.service';
import {FormControl} from '@angular/forms';
import {FileService} from '../../services/file.service';
import {FileDto} from '../../models/file-dto';
import {isNullOrUndefined, log} from 'util';

@Component({
  selector: 'json-json-tree',
  templateUrl: './json-tree.component.html',
  styleUrls: ['./json-tree.component.scss']
})
export class JsonTreeComponent implements OnInit {
  public currentNode: JsonNode;
  public files: FileDto[] = [];
  public treeControl = new NestedTreeControl<JsonNode>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<JsonNode>();
  private currentJsonDictionary: Object;
  private currentNestedJson: Object;
  public parentNode: JsonNode;
  private currentJsonNodes: JsonNode[];
  constructor(
    private jsonService: JsonService,
    private fileService: FileService
  ) {}

  ngOnInit() {}
  hasChild = (_: number, node: JsonNode) => !!node.children && node.children.length > 0;

  openNode(node: JsonNode) {
    this.toggleNode(node);
    this.currentNode = node;
    this.updateValueFormControl(this.files, this.currentNode);
  }

  private toggleNode(node: JsonNode) {
    if (this.currentNode) {
      this.currentNode.selected = false;
    }
    node.selected = true;
  }

  private updateValueFormControl(files: FileDto[], jsonNode: JsonNode) {
    files.forEach(file => {
      file.formControl.setValue(file.jsonDictionary[jsonNode.path]);
      if (!(jsonNode.path in file.jsonDictionary)) {
        file.notExisted = true;
        file.formControl.disable();
      } else {
        file.notExisted = false;
        file.formControl.enable();
      }
    });
  }

  updateValueForDictionary(file: FileDto) {
    file.jsonDictionary[this.currentNode.path] = file.formControl.value;
  }

  handleFileInput($event) {
    const fileImports: File[] = Array.from($event.target.files);
    fileImports.forEach(file => {
      this.fileService.readContentOfFile(file).toPromise().then(content => {
        const jsonObject = this.jsonService.parseToJson(content);
        const jsonDictionary = this.jsonService.buildDictionary(jsonObject, '', {});
        const fileDto = new FileDto(file.name, jsonDictionary, new FormControl());
        this.files.push(fileDto);
        this.initJsonTree(jsonObject, Object.assign({}, jsonDictionary));
      });
    });
  }

  private initJsonTree(jsonObject, jsonDictionary) {
    if (isNullOrUndefined(this.currentNestedJson)) {
      this.currentNestedJson = jsonObject;
      this.currentJsonDictionary = jsonDictionary;
    } else {
      this.currentJsonDictionary = this.jsonService.mergeKeys(this.currentJsonDictionary, jsonDictionary);
      this.currentNestedJson = this.jsonService.buildJson(this.currentJsonDictionary);
    }
    this.currentJsonNodes = this.jsonService.buildJsonNodes(this.currentNestedJson, [], '');
    this.updateJsonTreeData(this.currentJsonNodes);
  }

  private updateJsonTreeData(jsonNodes: JsonNode[]) {
    this.dataSource.data = null;
    this.dataSource.data = jsonNodes;
    this.treeControl.dataNodes = jsonNodes;
  }

  addKey(file: FileDto) {
    file.jsonDictionary[this.currentNode.path] = '';
    file.notExisted = false;
    file.formControl.enable();
  }

  removeKeyInFile(file: FileDto) {
    delete file.jsonDictionary[this.currentNode.path];
    file.notExisted = true;
    file.formControl.disable();
    file.formControl.setValue('');
  }

  removeKey() {
    this.files.forEach(file => {
      this.removeKeyInFile(file);
    });
    this.currentJsonNodes = this.removeNode(this.currentNode, this.currentJsonNodes);
    this.updateJsonTreeData(this.currentJsonNodes);
    this.currentNode = null;
  }

  private removeNode(node: JsonNode, jsonNodes: JsonNode[]): JsonNode[] {
    for (let i = 0; i < jsonNodes.length; i++) {
      if (jsonNodes[i].path === node.path) {
        jsonNodes.splice(i, 1);
        break;
      } else if (jsonNodes[i].children) {
        jsonNodes[i].children = this.removeNode(node, jsonNodes[i].children);
      }
    }
    return jsonNodes;
  }
}
