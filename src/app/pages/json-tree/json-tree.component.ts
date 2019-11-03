import {Component, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatDialog, MatTreeNestedDataSource} from '@angular/material';
import {JsonNode} from '../../models/json-node';
import {JsonService} from '../../services/json.service';
import {FormControl} from '@angular/forms';
import {FileService} from '../../services/file.service';
import {FileDto} from '../../models/file-dto';
import {isNullOrUndefined, log} from 'util';
import {AddKeyDialogComponent} from '../../components/add-key-dialog/add-key-dialog.component';

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
  private currentJsonNodes: JsonNode[];
  private editNumber = '';
  constructor(
    private jsonService: JsonService,
    private fileService: FileService,
    public dialog: MatDialog
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
    console.log(this.currentJsonNodes);
  }

  private updateJsonTreeData(jsonNodes: JsonNode[]) {
    this.dataSource.data = null;
    this.dataSource.data = jsonNodes;
    this.treeControl.dataNodes = jsonNodes;
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

  addKey(node: JsonNode) {
    this.dialog.open(AddKeyDialogComponent, {
      data: 'test'
    }).afterClosed();
    // node.children.push(new JsonNode());
    // console.log(sonDithis.currentJsonNodes);
    // this.updateJsonTreeData(this.currentJsonNodes);
  }

  enterEditMode(node: JsonNode) {
    this.editNumber = Date.now().toString();
    node.editingNumber = this.editNumber;
  }

  exitEditMode() {
    this.editNumber = '';
  }

  updateKeyName(node: JsonNode) {
    const parentNode = this.getNodeByPath(node.parentPath, this.currentJsonNodes);
    if (parentNode) {
      const equallyLevelNodes = parentNode.children.filter(childNode => childNode.name === 'newName');
      if (equallyLevelNodes.length > 0) {
        alert('Please change to another name, your name is duplicated');
      } else {
        node.name = 'newName';
        const newPath = this.getNewPath(node.path, 'newName');
        node = this.updatePathOfNode(node, newPath);
      }
    }
    // TODO: update name of node, and loop all files to check condition no duplicate in the same level
  }

  exportToFiles() {
    // TODO: should use jsonDictionary to export to file.
  }

  private getNodeByPath(path: string, jsonNodes: JsonNode[]): JsonNode {
    for (let i = 0; i < jsonNodes.length; i++) {
      if (path === jsonNodes[i].path) {
        return jsonNodes[i];
      } else if (jsonNodes[i].children) {
        const node = this.getNodeByPath(path, jsonNodes[i].children);
        if (node) {
          return node;
        }
      }
    }
    return null;
  }

  private getNewPath(path: string, newName: string): string {
    return path.substring(0, path.lastIndexOf('.')) + `.${newName}`;
  }

  private updatePathOfNode(node: JsonNode, newPath: string): JsonNode {
    const oldPath = node.path;
    node.path = newPath;
    this.files.forEach(file => {
      file.jsonDictionary[newPath] = file.jsonDictionary[oldPath];
      delete file.jsonDictionary[oldPath];
    });
    return node;
  }
}
