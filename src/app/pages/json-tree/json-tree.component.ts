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
      file.formControl.setValue(file.jsonDictionary[jsonNode.valueDic.path]);
    });
  }

  updateValueForDictionary(file: FileDto) {
    file.jsonDictionary[this.currentNode.valueDic.path] = file.formControl.value;
  }

  handleFileInput($event) {
    const fileImports: File[] = Array.from($event.target.files);
    fileImports.forEach(file => {
      this.fileService.readContentOfFile(file).toPromise().then(content => {
        const jsonObject = this.jsonService.parseToJson(content);
        const jsonDictionary = this.jsonService.buildDictionary(jsonObject, '', {});
        this.updateJsonTree(jsonObject, jsonDictionary);
        const fileDto = new FileDto(file.name, jsonDictionary, new FormControl());
        this.files.push(fileDto);
      });
    });
  }

  private updateJsonTree(jsonObject, jsonDictionary) {
    if (isNullOrUndefined(this.currentNestedJson)) {
      this.currentNestedJson = jsonObject;
      this.currentJsonDictionary = jsonDictionary;
    } else {
      this.currentJsonDictionary = this.jsonService.mergeKeys(this.currentJsonDictionary, jsonDictionary);
      this.currentNestedJson = this.jsonService.buildJson(this.currentJsonDictionary);
    }
    this.dataSource.data = [];
    this.dataSource.data = this.jsonService.buildJsonNodes(this.currentNestedJson, [], '');
  }
}
