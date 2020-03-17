import { JsonFlat } from './../../models/json-flat';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NestedTreeControl, FlatTreeControl} from '@angular/cdk/tree';
import {MatDialog, MatTreeNestedDataSource, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {JsonNode} from '../../models/json-node';
import {JsonService} from '../../services/json.service';
import {FormControl} from '@angular/forms';
import {FileService} from '../../services/file.service';
import {FileDto} from '../../models/file-dto';
import {isNullOrUndefined} from 'util';
import {AddKeyDialogComponent} from '../../components/add-key-dialog/add-key-dialog.component';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {flatten, unflatten} from 'flat';

function nodeTransformer(node: JsonNode, level: number) {
  // console.log(node);
  return {
    name: node.name,
    level,
    hasChildren: node.children ? node.children.length > 0 : false,
  };
}

// Function that gets a flat node's level
function getNodeLevel({level}: JsonFlat) {
  return level;
}

// Function that determines whether a flat node is expandable or not
function getIsNodeExpandable({hasChildren}: JsonFlat) {
  return hasChildren;
}

// Function that returns a nested node's list of children
function getNodeChildren({children}: JsonNode) {
  return children;
}

@Component({
  selector: 'json-json-tree',
  templateUrl: './json-tree.component.html',
  styleUrls: ['./json-tree.component.scss']
})
export class JsonTreeComponent implements OnInit {
  public currentNode: JsonNode;
  public files: FileDto[] = [];
  // public treeControl = new NestedTreeControl<JsonNode>(node => node.children);
  // public dataSource = new MatTreeNestedDataSource<JsonNode>();
  public treeControl = new FlatTreeControl<JsonFlat>(getNodeLevel, getIsNodeExpandable);
  public dataSource: MatTreeFlatDataSource<JsonNode, JsonFlat>;
  public isReviewMode: boolean;
  private currentJsonDictionary: Object;
  private currentNestedJson: Object;
  private currentJsonNodes: JsonNode[];
  private editNumber = '';
  constructor(
    public jsonService: JsonService,
    public fileService: FileService,
    public dialog: MatDialog,
  ) {}

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  ngOnInit() {}
  hasChild = (_: number, node: JsonNode) => !!node.children && node.children.length > 0;

  openNode(node: JsonNode) {
    this.toggleNode(node);
    this.currentNode = node;
    this.isReviewMode = false;
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
    let count = 0;
    fileImports.forEach(file => {

      this.fileService.readFile(file.path).then(content => {
        const jsonObject = this.jsonService.parseToJson(content);
        const jsonDictionary = flatten(jsonObject);

        const fileDto = new FileDto(file.path, file.name, jsonDictionary, new FormControl());
        this.files.push(fileDto);
        this.initJsonTree(jsonObject, Object.assign({}, jsonDictionary));
        count++;
        if (count === fileImports.length) {
          this.updateJsonTreeData(this.currentJsonNodes);
        }
      });
    });
  }

  private initJsonTree(jsonObject, jsonDictionary) {
    if (isNullOrUndefined(this.currentNestedJson)) {
      this.currentNestedJson = jsonObject;
      this.currentJsonDictionary = jsonDictionary;
    } else {
      this.currentJsonDictionary = this.jsonService.mergeKeys(this.currentJsonDictionary, jsonDictionary);
      this.currentNestedJson = unflatten(this.currentJsonDictionary);
      // this.currentNestedJson = this.jsonService.buildJson(this.currentJsonDictionary);
    }

    this.currentJsonNodes = this.jsonService.buildJsonNodes(this.currentNestedJson, [], '');
  }

  private updateJsonTreeData(jsonNodes: JsonNode[]) {
    // console.log(jsonNodes);
    const treeFlatener = new MatTreeFlattener<JsonNode, JsonFlat>(
      nodeTransformer,
      getNodeLevel,
      getIsNodeExpandable,
      getNodeChildren
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlatener);
    // this.dataSource.data = null;
    this.dataSource.data = jsonNodes;
  }

  addKeyInFile(file: FileDto) {
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

  removeKey(node: JsonNode) {
    this.currentNode = node;
    this.files.forEach(file => {
      this.removeKeyInFile(file);
    });
    this.currentJsonNodes = this.removeNode(node, this.currentJsonNodes);
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

  addKey(currentNode: JsonNode) {
    this.dialog.open(AddKeyDialogComponent, {
      data: {
        files: this.files,
        node: currentNode
      }
    }).afterClosed().subscribe(() => {
      this.updateJsonTreeData(this.currentJsonNodes);
    });
  }

  enterEditMode(node: JsonNode) {
    this.editNumber = Date.now().toString();
    node.editingNumber = this.editNumber;
  }

  exitEditMode(node: JsonNode) {
    this.editNumber = '';
    node.formControl.setValue(node.name);
  }

  updateKeyName(node: JsonNode) {
    if (this.isNewKeyExistedInThisLevel(node) || node.formControl.invalid) {
      this.exitEditMode(node);
      alert('Your key is duplicated or blank, please change it!');
    } else {
      this.editNumber = '';
      node.name = node.formControl.value;
      const oldPath = node.path;
      const newPath = node.path = this.jsonService.getCombinePath(node.name, node.path);
      this.updateParentPathOfChildren(node.path, node.children);
      this.updatePathOfDictionary(oldPath, newPath);
    }
  }

  private isNewKeyExistedInThisLevel(node: JsonNode) {
    const parentKey = node.parentPath;
    const parentNode = this.findNodeByPath(parentKey, this.currentJsonNodes);
    if (parentNode) {
      for (let i = 0; i < parentNode.children.length; i++) {
        if ((isNullOrUndefined(parentNode.children[i].editingNumber) || parentNode.children[i].editingNumber === '')
          && parentNode.children[i].name === node.formControl.value) {
          return true;
        }
      }
    }
    return false;
  }

  private findNodeByPath(path: string, jsonNodes: JsonNode[]): JsonNode {
    for (let i = 0; i < jsonNodes.length; i++) {
      if (jsonNodes[i].path === path) {
        return jsonNodes[i];
      }
      if (jsonNodes[i].children) {
        const node = this.findNodeByPath(path, jsonNodes[i].children);
        if (node) {
        return node;
        }
      }
    }
    return null;
  }

  reviewFiles() {
    this.isReviewMode = true;
    this.files.forEach(file => file.nestedJsonContent = this.jsonService.buildJson(file.jsonDictionary));
  }

  private updateParentPathOfChildren(path: string, nodes: JsonNode[]) {
    if (nodes) {
      nodes.forEach(node => node.parentPath = path);
    }
  }

  private updatePathOfDictionary(oldPath: string, newPath: string) {
    this.files.forEach(file => {
      file.jsonDictionary[newPath] = file.jsonDictionary[oldPath];
      delete file.jsonDictionary[oldPath];
    });
  }

  clearAll() {
    this.currentJsonNodes = null;
    this.currentJsonDictionary = null;
    this.currentNestedJson = null;
    this.currentNode = null;
    this.files = [];
    this.updateJsonTreeData(this.currentJsonNodes);
  }

  saveFile() {
    this.files.forEach(file => {
      file.nestedJsonContent = this.jsonService.buildJson(file.jsonDictionary);
      this.fileService.saveFile({path: file.path, content: this.jsonService.formatJsonString(file.nestedJsonContent)});
    });
  }
}
