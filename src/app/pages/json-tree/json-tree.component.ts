import {Component, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {JsonNode} from '../../models/json-node';
import {JsonService} from '../../services/json.service';
import {FormControl} from '@angular/forms';
import {FileService} from '../../services/file.service';
import {FileDto} from '../../models/file-dto';
import {isNullOrUndefined} from 'util';

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
    this.updateJsonTreeData(this.currentNestedJson);
  }

  private updateJsonTreeData(nestedJson: Object) {
    this.dataSource.data = null;
    const data = this.jsonService.buildJsonNodes(nestedJson, [], '');
    this.dataSource.data = data;
    this.treeControl.dataNodes = data;
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
    delete this.currentJsonDictionary[this.currentNode.path];
    this.currentNestedJson = this.jsonService.buildJson(this.currentJsonDictionary);
    this.updateJsonTreeData(this.currentNestedJson);
    this.parentNode = this.currentNode.parent;
    this.currentNode = null;
    this.expandNode(this.parentNode);
  }

  public expandNode(node: JsonNode) {
    if (node.parent) {
      this.expandNode(node.parent);
    }
    this.treeControl.expand(node);
  }
}
