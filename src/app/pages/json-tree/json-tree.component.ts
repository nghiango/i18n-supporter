import { JsonFlat } from '../../models/json-flat';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JsonService } from '../../services/json.service';
import { FormControl } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { FileDto } from '../../models/file-dto';
import { AddKeyDialogComponent } from '../../components/add-key-dialog/add-key-dialog.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { flatten, unflatten } from 'flat';
import { Subscription } from 'rxjs';
import { ArrayDataSource } from '@angular/cdk/collections';
import { insert } from 'src/app/shared/arrays';
import { isNullOrUndefined } from 'src/app/services/util';

@Component({
  selector: 'json-json-tree',
  templateUrl: './json-tree.component.html',
  styleUrls: ['./json-tree.component.scss']
})
export class JsonTreeComponent implements OnInit {
  public currentNode: JsonFlat;
  public files: FileDto[] = [];
  public dataSource: ArrayDataSource<JsonFlat>;
  public nodeHeader = '';
  public isReviewMode: boolean;
  private currentJsonDictionary: Object;
  private currentNestedJson: Object;
  private currentJsonFlats: JsonFlat[];
  private editingKey = '';
  public filterControl = new FormControl();
  private toTest = {
    'components': {
      'duplicateOverlay': {
        'gender': 'Gender',
        'what': 'asd'
      }
    },
    'profile': {
      'person': {
        'name': 'Nghia'
      }
    }
  };

  private contextMenuX: number;
  private contextMenuY: number;
  public contextMenu: boolean;

  private subscription = new Subscription();

  constructor(
    public jsonService: JsonService,
    public fileService: FileService,
    public dialog: MatDialog,
  ) {
  }

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  ngOnInit() {
    this.subscription.add(this.filterControl.valueChanges.subscribe(value => console.log(value)));
    if (this.toTest) {
      const jsonDictionary = flatten(this.toTest);
      const fileDto = new FileDto('test', 'test', jsonDictionary, new FormControl());
      this.files.push(fileDto);
      this.initJsonTree(this.toTest, Object.assign({}, jsonDictionary));
      this.updateJsonTreeData(this.currentJsonFlats);
    }
  }

  private toggleNode(node: JsonFlat) {
    node.isExpanded = !node.isExpanded;
    if (node.hasChildren && !node.isExpanded) {
      const childNodes = this.getChildNodes(node);
      for (let i = 0; i < childNodes.length; i++) {
        childNodes[i].isExpanded = node.isExpanded;
      }
    }
  }

  private updateValueFormControl(files: FileDto[], path: string) {
    files.forEach(file => {
      file.formControl.setValue(file.jsonDictionary[path]);
      if (!(path in file.jsonDictionary)) {
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
          this.updateJsonTreeData(this.currentJsonFlats);
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
    }

    this.currentJsonFlats = this.jsonService.buildJsonFlats(this.currentNestedJson, '', 1, []);
  }

  private updateJsonTreeData(jsonFlats: JsonFlat[]) {
    this.dataSource = new ArrayDataSource(jsonFlats);
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

  removeKey() {
    this.files.forEach(file => {
      this.removeKeyInFile(file);
    });
    this.currentJsonFlats = this.removeNode(this.currentNode, this.currentJsonFlats);
    this.updateJsonTreeData(this.currentJsonFlats);
    this.currentNode = null;
    this.nodeHeader = '';
  }

  private removeNode = (node: JsonFlat, jsonFlats: JsonFlat[]): JsonFlat[] => {
    for (let i = 0; i < jsonFlats.length; i++) {
      if (jsonFlats[i].path === node.path) {
        jsonFlats.splice(i, 1);
        break;
      }
    }
    return jsonFlats;
  }

  addKey() {
    this.dialog.open(AddKeyDialogComponent, {
      data: {
        files: this.files,
        node: this.currentNode
      }
    }).afterClosed().subscribe(value => {
      if (!value) {
        return;
      }
      let parentIndex = this.currentJsonFlats.indexOf(this.currentNode);
      insert(this.currentJsonFlats, ++parentIndex, value);
      this.updateJsonTreeData(this.currentJsonFlats);
    });
  }

  enterEditMode() {
    this.editingKey = Date.now().toString();
    this.currentNode.editingKey = this.editingKey;
  }

  exitEditMode(node: JsonFlat) {
    this.editingKey = '';
    node.formControl.setValue(node.name);
  }

  updateKeyName(node: JsonFlat) {
    if (this.isNewKeyExistedInThisLevel(node) || node.formControl.invalid) {
      this.exitEditMode(node);
      alert('Your key is duplicated or blank, please change it!');
    } else {
      this.editingKey = '';
      node.name = node.formControl.value;
      const oldPath = node.path;
      const newPath = node.path = this.jsonService.getCombinePath(node.name, node.path);
      this.updateParentPathOfChildren(node);
      this.updatePathOfDictionary(oldPath, newPath);
    }
  }

  private isNewKeyExistedInThisLevel(node: JsonFlat) {
    const parentNode = this.getParentNode(node);
    if (parentNode) {
      const childrenNodes = this.getChildNodes(parentNode);
      for (let i = 0; i < childrenNodes.length; i++) {
        if ((isNullOrUndefined(childrenNodes[i].editingKey) || childrenNodes[i].editingKey === '')
          && childrenNodes[i].name === node.formControl.value) {
          return true;
        }
      }
    }
    return false;
  }

  reviewFiles() {
    this.isReviewMode = true;
    this.files.forEach(file => file.nestedJsonContent = this.jsonService.buildJson(file.jsonDictionary));
  }

  private updateParentPathOfChildren(parentNode: JsonFlat) {
    const childNodes = this.getChildNodes(parentNode);
    if (childNodes) {
      // TODO: Should think again of update parent Path
      // childNodes.forEach(node => node.parentPath = parentNode.path);
    }
  }

  private updatePathOfDictionary(oldPath: string, newPath: string) {
    this.files.forEach(file => {
      file.jsonDictionary[newPath] = file.jsonDictionary[oldPath];
      delete file.jsonDictionary[oldPath];
    });
  }

  clearAll() {
    this.currentJsonFlats = null;
    this.currentJsonDictionary = null;
    this.currentNestedJson = null;
    this.currentNode = null;
    this.files = [];
    this.updateJsonTreeData(this.currentJsonFlats);
  }

  saveFile() {
    this.files.forEach(file => {
      file.nestedJsonContent = this.jsonService.buildJson(file.jsonDictionary);
      this.fileService.saveFile({path: file.path, content: this.jsonService.formatJsonString(file.nestedJsonContent)});
    });
  }

  openNodeFlat(node: JsonFlat) {
    this.toggleNode(node);
    if (!node.hasChildren) {
      if (this.currentNode) {
        this.currentNode.selected = false;
      }
      this.currentNode = node;
      this.nodeHeader = this.currentNode.name;
      node.selected = true;
      this.isReviewMode = false;
      this.updateValueFormControl(this.files, node.path);
    }
  }

  onRightClick(event: MouseEvent, node: JsonFlat) {
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenu = !this.contextMenu;
    this.currentNode = node;
  }

  disableContextMenu() {
    this.contextMenu = false;
  }

  public shouldRender(node: JsonFlat): boolean {
    const parent = this.getParentNode(node);
    return !parent || parent.isExpanded;
  }

  private getParentNode(node: JsonFlat): JsonFlat {
    const nodeIndex = this.currentJsonFlats.indexOf(node);
    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (this.currentJsonFlats[i].level === node.level - 1) {
        return this.currentJsonFlats[i];
      }
    }
    return null;
  }

  private getChildNodes(node: JsonFlat): JsonFlat[] {
    const children = [];
    const nodeIndex = this.currentJsonFlats.indexOf(node);
    for (let i = nodeIndex + 1; i < this.currentJsonFlats.length; i++) {
      if (this.currentJsonFlats[i].parentPath.startsWith(node.path)) {
        children.push(this.currentJsonFlats[i]);
      } else {
        break;
      }
    }
    return children;
  }
}
